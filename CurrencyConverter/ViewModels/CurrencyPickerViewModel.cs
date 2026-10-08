using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using CurrencyConverter.Core.Data;
using CurrencyConverter.Core.Services;

namespace CurrencyConverter.ViewModels;

[QueryProperty(nameof(Field), "field")]
public sealed partial class CurrencyPickerViewModel : SessionViewModel
{
    public CurrencyPickerViewModel(AppSession session) : base(session)
    {
    }

    public ObservableCollection<CurrencyRowItem> Items { get; } = [];

    [ObservableProperty]
    private string field = "base";

    [ObservableProperty]
    private string query = string.Empty;

    [ObservableProperty]
    private bool showEmpty;

    partial void OnFieldChanged(string value) => Refresh();

    partial void OnQueryChanged(string value) => Refresh();

    protected override void Refresh()
    {
        var available = Session.Rates.Count > 0 ? Session.Rates.Keys : null;
        var needle = Query.Trim();
        var next = CurrencyCatalog.ListKnown(available)
            .Where(item =>
                needle.Length == 0 ||
                item.Code.Contains(needle, StringComparison.OrdinalIgnoreCase) ||
                item.Name.Contains(needle, StringComparison.OrdinalIgnoreCase))
            .Select(item => new CurrencyRowItem
            {
                Code = item.Code,
                Name = item.Name,
                IsFavorite = Session.Favorites.Contains(item.Code),
            })
            .OrderByDescending(item => item.IsFavorite)
            .ThenBy(item => item.Code, StringComparer.Ordinal)
            .ToList();

        Items.Clear();
        foreach (var item in next)
        {
            Items.Add(item);
        }

        ShowEmpty = Items.Count == 0;
    }

    [RelayCommand]
    private async Task Choose(string code)
    {
        switch (Field)
        {
            case "from":
                Session.SetFrom(code);
                break;
            case "to":
                Session.SetTo(code);
                break;
            default:
                Session.SetDisplayBase(code);
                break;
        }

        if (Shell.Current is not null)
        {
            await Shell.Current.GoToAsync("..");
        }
    }

    [RelayCommand]
    private void ToggleFavorite(string code) => Session.ToggleFavorite(code);
}
