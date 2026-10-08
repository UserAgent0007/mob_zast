namespace CurrencyConverter.Core.Models;

public sealed record HistoryItem(
    string Id,
    string From,
    string To,
    decimal Amount,
    decimal Result,
    decimal Rate,
    string AmountLabel,
    string ResultLabel,
    string RateLabel,
    string CreatedAt,
    string CreatedAtLabel);
