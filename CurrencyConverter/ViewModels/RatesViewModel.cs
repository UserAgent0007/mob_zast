using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using CurrencyConverter.Core.Data;
using CurrencyConverter.Core.Services;
using CurrencyConverter.Views;

namespace CurrencyConverter.ViewModels;

public sealed partial class RatesViewModel : SessionViewModel
{
    public RatesViewModel(AppSession session) : base(session)
    {
    }

    public ObservableCollection<RateRowItem> Items { get; } = [];

    [ObservableProperty]
    private string query = string.Empty;

    [ObservableProperty]
    private string subtitle = string.Empty;

    [ObservableProperty]
    private string baseCode = "UAH";

    [ObservableProperty]
    private bool isBusy;

    [ObservableProperty]
    private bool isRefreshing;

    [ObservableProperty]
    private bool hasItems;

    [ObservableProperty]
    private bool showEmpty;

    [ObservableProperty]
    private bool hasError;

    [ObservableProperty]
    private string emptyTitle = string.Empty;

    partial void OnQueryChanged(string value) => Refresh();

    protected override void Refresh()
    {
        var next = BuildItems();
        Items.Clear();
        foreach (var item in next)
        {
            Items.Add(item);
        }

        var loading = Session.Status == "loading";
        HasItems = Items.Count > 0;
        IsBusy = loading && !HasItems;
        IsRefreshing = loading && HasItems;
        HasError = Session.Status == "failed";
        ShowEmpty = !IsBusy && !HasItems;
        EmptyTitle = HasError
            ? Session.Error ?? "Невідома помилка завантаження курсів."
            : "Немає валют за цим запитом";

        var baseCurrency = CurrencyCatalog.Get(Session.DisplayBase);
        BaseCode = baseCurrency.Code;
        Subtitle = $"1 {baseCurrency.Code} · {MoneyMath.FormatUpdatedAt(Session.UpdatedAt)}";
    }

    [RelayCommand]
    private Task ChooseBase() => OpenPicker("base");

    [RelayCommand]
    private Task RefreshRates() => Session.LoadRatesAsync();

    [RelayCommand]
    private void ToggleFavorite(string code) => Session.ToggleFavorite(code);

    [RelayCommand]
    private Task OpenRate(string code)
    {
        return Shell.Current is null
            ? Task.CompletedTask
            : Shell.Current.GoToAsync($"{nameof(RateDetailsPage)}?from={Session.DisplayBase}&to={code}");
    }

    private List<RateRowItem> BuildItems()
    {
        if (Session.Rates.Count == 0)
        {
            return [];
        }

        var needle = Query.Trim();
        return CurrencyCatalog.ListKnown(Session.Rates.Keys)
            .Where(item => item.Code != Session.DisplayBase)
            .Where(item =>
                needle.Length == 0 ||
                item.Code.Contains(needle, StringComparison.OrdinalIgnoreCase) ||
                item.Name.Contains(needle, StringComparison.OrdinalIgnoreCase))
            .Select(item =>
            {
                var rate = MoneyMath.CrossRate(Session.DisplayBase, item.Code, Session.Rates);
                return new RateRowItem
                {
                    Code = item.Code,
                    Name = item.Name,
                    ValueText = MoneyMath.FormatRate(rate),
                    IsFavorite = Session.Favorites.Contains(item.Code),
                };
            })
            .OrderByDescending(item => item.IsFavorite)
            .ThenBy(item => item.Code, StringComparer.Ordinal)
            .ToList();
    }

    private static Task OpenPicker(string field)
    {
        return Shell.Current is null
            ? Task.CompletedTask
            : Shell.Current.GoToAsync($"{nameof(CurrencyPickerPage)}?field={field}");
    }
}
