namespace CurrencyConverter.Core.Models;

public sealed record RatesSnapshot(
    string Base,
    IReadOnlyDictionary<string, decimal> Rates,
    string UpdatedAt,
    string Provider);
