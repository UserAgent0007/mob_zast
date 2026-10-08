using System.Globalization;
using CurrencyConverter.Core.Services;

namespace CurrencyConverter.Core.Tests;

public class MoneyMathTests
{
    private static readonly CultureInfo Ukrainian = CultureInfo.GetCultureInfo("uk-UA");

    [Theory]
    [InlineData("1000", 1000)]
    [InlineData("1 000,50", 1000.50)]
    [InlineData("12.5", 12.5)]
    [InlineData("", 0)]
    [InlineData(".", 0)]
    [InlineData("abc", 0)]
    public void ParseAmount_reads_ukrainian_and_plain_input(string input, decimal expected)
    {
        Assert.Equal(expected, MoneyMath.ParseAmount(input));
    }

    [Fact]
    public void FormatAmount_uses_ukrainian_grouping()
    {
        var expected = 1000.5m.ToString("N2", Ukrainian);
        Assert.Equal(expected, MoneyMath.FormatAmount(1000.5m, 2));
        Assert.Equal("—", MoneyMath.FormatAmount(null));
    }

    [Fact]
    public void FormatRate_keeps_more_digits_for_small_values()
    {
        Assert.Equal(41.123456m.ToString("#,0.00##", Ukrainian), MoneyMath.FormatRate(41.123456m));
        Assert.Equal(0.0123456m.ToString("#,0.00####", Ukrainian), MoneyMath.FormatRate(0.0123456m));
        Assert.Equal("—", MoneyMath.FormatRate(null));
    }

    [Fact]
    public void CrossRate_and_convert_use_quote_table()
    {
        var rates = new Dictionary<string, decimal>
        {
            ["USD"] = 1m,
            ["UAH"] = 40m,
            ["EUR"] = 0.9m,
        };

        Assert.Equal(40m, MoneyMath.CrossRate("USD", "UAH", rates));
        Assert.Equal(0.025m, MoneyMath.CrossRate("UAH", "USD", rates));
        Assert.Equal(1000m, MoneyMath.ConvertAmount(25m, "USD", "UAH", rates));
        Assert.Null(MoneyMath.CrossRate("USD", "GBP", rates));
    }

    [Fact]
    public void FormatUpdatedAt_handles_missing_and_rfc1123()
    {
        Assert.Equal("ще не оновлено", MoneyMath.FormatUpdatedAt(null));
        Assert.Equal("не дата", MoneyMath.FormatUpdatedAt("не дата"));

        var formatted = MoneyMath.FormatUpdatedAt("Wed, 07 Oct 2026 12:30:00 +0000");
        Assert.Contains("07", formatted);
        Assert.Contains(":", formatted);
    }
}
