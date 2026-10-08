using System.Globalization;

namespace CurrencyConverter.Core.Services;

public static class MoneyMath
{
    private static readonly CultureInfo Ukrainian = CultureInfo.GetCultureInfo("uk-UA");

    public static decimal ParseAmount(string? value)
    {
        var normalized = new string((value ?? string.Empty)
            .Replace(',', '.')
            .Where(character => char.IsDigit(character) || character == '.')
            .ToArray());

        if (string.IsNullOrEmpty(normalized) || normalized == ".")
        {
            return 0;
        }

        var firstDot = normalized.IndexOf('.');
        if (firstDot >= 0)
        {
            normalized = normalized[..(firstDot + 1)] + normalized[(firstDot + 1)..].Replace(".", string.Empty);
        }

        return decimal.TryParse(normalized, NumberStyles.Number, CultureInfo.InvariantCulture, out var parsed)
            ? parsed
            : 0;
    }

    public static string FormatAmount(decimal? value, int decimals = 2)
    {
        if (value is not decimal amount)
        {
            return "—";
        }

        var digits = Math.Clamp(decimals, 0, 6);
        return amount.ToString($"N{digits}", Ukrainian);
    }

    public static string FormatRate(decimal? value)
    {
        if (value is not decimal rate)
        {
            return "—";
        }

        var pattern = rate >= 1 ? "#,0.00##" : "#,0.00####";
        return rate.ToString(pattern, Ukrainian);
    }

    public static string FormatUpdatedAt(string? isoDate)
    {
        if (string.IsNullOrWhiteSpace(isoDate))
        {
            return "ще не оновлено";
        }

        if (!DateTimeOffset.TryParse(isoDate, CultureInfo.InvariantCulture, DateTimeStyles.AllowWhiteSpaces, out var parsed)
            && !DateTimeOffset.TryParse(isoDate, Ukrainian, DateTimeStyles.AllowWhiteSpaces, out parsed))
        {
            return isoDate;
        }

        return parsed.ToLocalTime().ToString("dd MMM HH:mm", Ukrainian);
    }

    public static decimal? ConvertAmount(decimal amount, string from, string to, IReadOnlyDictionary<string, decimal> rates)
    {
        var rate = CrossRate(from, to, rates);
        return rate is null ? null : amount * rate.Value;
    }

    public static decimal? CrossRate(string from, string to, IReadOnlyDictionary<string, decimal> rates)
    {
        if (!rates.TryGetValue(from, out var fromRate) || fromRate == 0)
        {
            return null;
        }

        if (!rates.TryGetValue(to, out var toRate))
        {
            return null;
        }

        return toRate / fromRate;
    }
}
