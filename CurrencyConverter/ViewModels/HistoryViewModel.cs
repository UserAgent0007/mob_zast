using System.Collections.ObjectModel;
using System.Globalization;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using CurrencyConverter.Core.Data;
using CurrencyConverter.Core.Services;

namespace CurrencyConverter.ViewModels;

public sealed partial class HistoryViewModel : SessionViewModel
{
    public HistoryViewModel(AppSession session) : base(session)
    {
    }

    public ObservableCollection<HistoryRow> Items { get; } = [];

    [ObservableProperty]
    private string subtitle = "Поки що порожньо";

    [ObservableProperty]
    private bool hasItems;

    [ObservableProperty]
    private bool showEmpty;

    protected override void Refresh()
    {
        Items.Clear();
        foreach (var item in Session.History)
        {
            var from = CurrencyCatalog.Get(item.From);
            var to = CurrencyCatalog.Get(item.To);
            Items.Add(new HistoryRow
            {
                Id = item.Id,
                From = item.From,
                To = item.To,
                Amount = item.Amount,
                PairText = $"{from.Code} → {to.Code}",
                ResultText = $"{item.AmountLabel} {from.Symbol} = {item.ResultLabel} {to.Symbol}",
                RateText = $"Курс {item.RateLabel}",
                TimeText = item.CreatedAtLabel,
            });
        }

        HasItems = Items.Count > 0;
        ShowEmpty = !HasItems;
        Subtitle = Describe(Items.Count);
    }

    [RelayCommand]
    private async Task Restore(HistoryRow? row)
    {
        if (row is null || Shell.Current is null)
        {
            return;
        }

        Session.SetPair(row.From, row.To, row.Amount.ToString(CultureInfo.InvariantCulture));
        await Shell.Current.GoToAsync("//Converter");
    }

    [RelayCommand]
    private void Remove(string id) => Session.RemoveHistoryItem(id);

    [RelayCommand]
    private void Clear() => Session.ClearHistory();

    private static string Describe(int count)
    {
        if (count == 0)
        {
            return "Поки що порожньо";
        }

        var noun = (count % 10, count % 100) switch
        {
            (1, not 11) => "збережена конвертація",
            (>= 2 and <= 4, not (>= 12 and <= 14)) => "збережені конвертації",
            _ => "збережених конвертацій",
        };
        return $"{count} {noun}";
    }
}
