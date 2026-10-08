using System.Collections.ObjectModel;
using System.Globalization;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using CurrencyConverter.Core.Data;
using CurrencyConverter.Core.Models;
using CurrencyConverter.Core.Services;
using CurrencyConverter.Views;

namespace CurrencyConverter.ViewModels;

public sealed partial class ConverterViewModel : SessionViewModel
{
    public ConverterViewModel(AppSession session) : base(session)
    {
    }

    public ObservableCollection<PopularPair> Popular { get; } = [];

    [ObservableProperty]
    private string amount = string.Empty;

    [ObservableProperty]
    private string fromCode = "UAH";

    [ObservableProperty]
    private string fromName = string.Empty;

    [ObservableProperty]
    private string toCode = "USD";

    [ObservableProperty]
    private string toName = string.Empty;

    [ObservableProperty]
    private string resultText = "—";

    [ObservableProperty]
    private string rateText = "—";

    [ObservableProperty]
    private string subtitle = "Завантаження курсів…";

    [ObservableProperty]
    private Color subtitleColor = Color.FromArgb("#8AA399");

    [ObservableProperty]
    private bool canSave;

    [ObservableProperty]
    private bool showRetry;

    partial void OnAmountChanged(string value)
    {
        if (Session.Amount != value)
        {
            Session.SetAmount(value);
        }
    }

    protected override void Refresh()
    {
        if (Amount != Session.Amount)
        {
            Amount = Session.Amount;
        }

        var from = CurrencyCatalog.Get(Session.From);
        var to = CurrencyCatalog.Get(Session.To);
        FromCode = from.Code;
        FromName = from.Name;
        ToCode = to.Code;
        ToName = to.Name;

        var numeric = MoneyMath.ParseAmount(Session.Amount);
        var result = MoneyMath.ConvertAmount(numeric, Session.From, Session.To, Session.Rates);
        var rate = MoneyMath.CrossRate(Session.From, Session.To, Session.Rates);
        ResultText = MoneyMath.FormatAmount(result, Session.Decimals);
        RateText = $"1 {from.Code} = {MoneyMath.FormatRate(rate)} {to.Code}";
        CanSave = result is not null && numeric > 0;

        if (Session.Status == "failed")
        {
            Subtitle = Session.Error ?? "Невідома помилка завантаження курсів.";
            SubtitleColor = Color.FromArgb("#E07A6A");
            ShowRetry = true;
        }
        else if (Session.Status == "loading" && string.IsNullOrEmpty(Session.UpdatedAt))
        {
            Subtitle = "Завантаження курсів…";
            SubtitleColor = Color.FromArgb("#8AA399");
            ShowRetry = false;
        }
        else
        {
            Subtitle = $"Оновлено {MoneyMath.FormatUpdatedAt(Session.UpdatedAt)}";
            SubtitleColor = Color.FromArgb("#8AA399");
            ShowRetry = false;
        }

        UpdatePopular();
    }

    [RelayCommand]
    private void Swap() => Session.SwapCurrencies();

    [RelayCommand]
    private void SelectQuickAmount(string value) => Session.SetAmount(value);

    [RelayCommand]
    private void SelectPopular(string code) => Session.SetPair(Session.From, code);

    [RelayCommand]
    private Task ChooseFrom() => OpenPicker("from");

    [RelayCommand]
    private Task ChooseTo() => OpenPicker("to");

    [RelayCommand]
    private Task RefreshRates() => Session.LoadRatesAsync();

    [RelayCommand]
    private async Task Save()
    {
        var numeric = MoneyMath.ParseAmount(Session.Amount);
        var result = MoneyMath.ConvertAmount(numeric, Session.From, Session.To, Session.Rates);
        var rate = MoneyMath.CrossRate(Session.From, Session.To, Session.Rates);
        if (result is null || rate is null || numeric <= 0)
        {
            return;
        }

        var now = DateTimeOffset.Now;
        Session.AddHistoryItem(new HistoryItem(
            Guid.NewGuid().ToString("N"),
            Session.From,
            Session.To,
            numeric,
            result.Value,
            rate.Value,
            MoneyMath.FormatAmount(numeric, Session.Decimals),
            MoneyMath.FormatAmount(result, Session.Decimals),
            MoneyMath.FormatRate(rate),
            now.ToString("O", CultureInfo.InvariantCulture),
            MoneyMath.FormatUpdatedAt(now.ToString("O", CultureInfo.InvariantCulture))));

        if (Shell.Current is not null)
        {
            await Shell.Current.GoToAsync("//History");
        }
    }

    private void UpdatePopular()
    {
        var codes = CurrencyCatalog.PopularCodes.Where(code => code != Session.From).Take(4).ToList();
        if (Popular.Count == codes.Count && Popular.Select(item => item.Code).SequenceEqual(codes))
        {
            for (var index = 0; index < codes.Count; index++)
            {
                var label = $"{Session.From} → {codes[index]}";
                if (Popular[index].Label != label)
                {
                    Popular[index] = new PopularPair { Code = codes[index], Label = label };
                }
            }

            return;
        }

        Popular.Clear();
        foreach (var code in codes)
        {
            Popular.Add(new PopularPair
            {
                Code = code,
                Label = $"{Session.From} → {code}",
            });
        }
    }

    private static Task OpenPicker(string field)
    {
        return Shell.Current is null
            ? Task.CompletedTask
            : Shell.Current.GoToAsync($"{nameof(CurrencyPickerPage)}?field={field}");
    }
}
