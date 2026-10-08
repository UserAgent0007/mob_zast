using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using CurrencyConverter.Core.Data;
using CurrencyConverter.Core.Services;

namespace CurrencyConverter.ViewModels;

[QueryProperty(nameof(FromCode), "from")]
[QueryProperty(nameof(ToCode), "to")]
public sealed partial class RateDetailsViewModel : SessionViewModel
{
    private static readonly int[] Samples = [1, 10, 100, 1000];

    public RateDetailsViewModel(AppSession session) : base(session)
    {
    }

    public ObservableCollection<SampleLine> SampleLines { get; } = [];

    [ObservableProperty]
    private string fromCode = string.Empty;

    [ObservableProperty]
    private string toCode = string.Empty;

    [ObservableProperty]
    private string pairText = "—";

    [ObservableProperty]
    private string rateText = "—";

    [ObservableProperty]
    private string caption = string.Empty;

    [ObservableProperty]
    private string inverseText = "—";

    [ObservableProperty]
    private string favoriteLabel = "Додати в обране";

    partial void OnFromCodeChanged(string value) => Refresh();

    partial void OnToCodeChanged(string value) => Refresh();

    protected override void OnDeactivated()
    {
        FromCode = string.Empty;
        ToCode = string.Empty;
    }

    protected override void Refresh()
    {
        if (string.IsNullOrWhiteSpace(FromCode) || string.IsNullOrWhiteSpace(ToCode))
        {
            PairText = "—";
            RateText = "—";
            Caption = string.Empty;
            InverseText = "—";
            SampleLines.Clear();
            return;
        }

        var from = CurrencyCatalog.Get(FromCode);
        var to = CurrencyCatalog.Get(ToCode);
        var rate = MoneyMath.CrossRate(FromCode, ToCode, Session.Rates);
        var inverse = MoneyMath.CrossRate(ToCode, FromCode, Session.Rates);
        PairText = $"{from.Code} → {to.Code}";
        RateText = MoneyMath.FormatRate(rate);
        Caption = $"1 {from.Name} = {MoneyMath.FormatRate(rate)} {to.Name}";
        InverseText = $"1 {to.Code} = {MoneyMath.FormatRate(inverse)} {from.Code}";
        FavoriteLabel = Session.Favorites.Contains(ToCode) ? "Прибрати з обраного" : "Додати в обране";

        SampleLines.Clear();
        foreach (var amount in Samples)
        {
            var converted = MoneyMath.ConvertAmount(amount, FromCode, ToCode, Session.Rates);
            SampleLines.Add(new SampleLine
            {
                FromText = $"{MoneyMath.FormatAmount(amount, 0)} {from.Code}",
                ToText = $"{MoneyMath.FormatAmount(converted, Session.Decimals)} {to.Code}",
            });
        }
    }

    [RelayCommand]
    private async Task OpenConverter()
    {
        if (string.IsNullOrWhiteSpace(FromCode) || string.IsNullOrWhiteSpace(ToCode) || Shell.Current is null)
        {
            return;
        }

        Session.SetPair(FromCode, ToCode, "1");
        await Shell.Current.GoToAsync("//Converter");
    }

    [RelayCommand]
    private void ToggleFavorite()
    {
        if (!string.IsNullOrWhiteSpace(ToCode))
        {
            Session.ToggleFavorite(ToCode);
        }
    }
}
