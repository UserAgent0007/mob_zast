using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using CurrencyConverter.Core.Data;
using CurrencyConverter.Core.Services;
using CurrencyConverter.Views;

namespace CurrencyConverter.ViewModels;

public sealed partial class SettingsViewModel : SessionViewModel
{
    public SettingsViewModel(AppSession session) : base(session)
    {
        ArchitectureText =
            "Shell з вкладками перемикає конвертер, курси, історію та налаштування. " +
            "Стек відкриває вибір валюти і деталі пари. AppSession тримає курси, суму, історію та налаштування " +
            "і зберігає їх через Preferences.";
    }

    public ObservableCollection<FavoriteChip> Favorites { get; } = [];

    public string ArchitectureText { get; }

    [ObservableProperty]
    private int decimals = 2;

    [ObservableProperty]
    private string baseText = string.Empty;

    [ObservableProperty]
    private string providerText = "ExchangeRate-API";

    [ObservableProperty]
    private string updatedText = string.Empty;

    protected override void Refresh()
    {
        Decimals = Session.Decimals;
        var currency = CurrencyCatalog.Get(Session.DisplayBase);
        BaseText = $"{currency.Code} · {currency.Name}";
        ProviderText = string.IsNullOrWhiteSpace(Session.Provider) ? "ExchangeRate-API" : Session.Provider;
        UpdatedText = $"Мережевий виклик: open.er-api.com. Останнє оновлення {MoneyMath.FormatUpdatedAt(Session.UpdatedAt)}.";

        Favorites.Clear();
        foreach (var code in Session.Favorites)
        {
            Favorites.Add(new FavoriteChip { Code = code });
        }
    }

    [RelayCommand]
    private void SelectDecimals(string value)
    {
        if (int.TryParse(value, out var decimals))
        {
            Session.SetDecimals(decimals);
        }
    }

    [RelayCommand]
    private Task ChooseBase()
    {
        return Shell.Current is null
            ? Task.CompletedTask
            : Shell.Current.GoToAsync($"{nameof(CurrencyPickerPage)}?field=base");
    }

    [RelayCommand]
    private void ToggleFavorite(string code) => Session.ToggleFavorite(code);

    [RelayCommand]
    private Task RefreshRates() => Session.LoadRatesAsync();
}
