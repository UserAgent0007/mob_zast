using CurrencyConverter.Core.Models;

namespace CurrencyConverter.Core.Data;

public static class CurrencyCatalog
{
    public static IReadOnlyDictionary<string, CurrencyInfo> All { get; } = new Dictionary<string, CurrencyInfo>
    {
        ["UAH"] = new("UAH", "Українська гривня", "₴"),
        ["USD"] = new("USD", "Долар США", "$"),
        ["EUR"] = new("EUR", "Євро", "€"),
        ["GBP"] = new("GBP", "Фунт стерлінгів", "£"),
        ["PLN"] = new("PLN", "Польський злотий", "zł"),
        ["CZK"] = new("CZK", "Чеська крона", "Kč"),
        ["CHF"] = new("CHF", "Швейцарський франк", "Fr"),
        ["JPY"] = new("JPY", "Японська єна", "¥"),
        ["CAD"] = new("CAD", "Канадський долар", "C$"),
        ["AUD"] = new("AUD", "Австралійський долар", "A$"),
        ["CNY"] = new("CNY", "Китайський юань", "¥"),
        ["TRY"] = new("TRY", "Турецька ліра", "₺"),
        ["SEK"] = new("SEK", "Шведська крона", "kr"),
        ["NOK"] = new("NOK", "Норвезька крона", "kr"),
        ["DKK"] = new("DKK", "Данська крона", "kr"),
        ["RON"] = new("RON", "Румунський лей", "lei"),
        ["HUF"] = new("HUF", "Угорський форинт", "Ft"),
        ["MDL"] = new("MDL", "Молдовський лей", "L"),
        ["GEL"] = new("GEL", "Грузинський ларі", "₾"),
        ["ILS"] = new("ILS", "Ізраїльський шекель", "₪"),
        ["INR"] = new("INR", "Індійська рупія", "₹"),
        ["KRW"] = new("KRW", "Південнокорейська вона", "₩"),
        ["BRL"] = new("BRL", "Бразильський реал", "R$"),
        ["MXN"] = new("MXN", "Мексиканське песо", "Mex$"),
        ["SGD"] = new("SGD", "Сінгапурський долар", "S$"),
        ["NZD"] = new("NZD", "Новозеландський долар", "NZ$"),
        ["AED"] = new("AED", "Дирхам ОАЕ", "د.إ"),
        ["KZT"] = new("KZT", "Казахстанський тенге", "₸"),
        ["BGN"] = new("BGN", "Болгарський лев", "лв"),
    };

    public static IReadOnlyList<string> PopularCodes { get; } =
        ["UAH", "USD", "EUR", "PLN", "GBP", "CZK", "CHF"];

    public static IReadOnlyList<int> QuickAmounts { get; } = [1, 10, 50, 100, 500, 1000];

    public static IReadOnlyList<string> DefaultFavorites { get; } = ["UAH", "USD", "EUR", "PLN", "GBP"];

    public static CurrencyInfo Get(string code)
    {
        if (All.TryGetValue(code, out var currency))
        {
            return currency;
        }

        return new CurrencyInfo(code, code, code);
    }

    public static IReadOnlyList<CurrencyInfo> ListKnown(IEnumerable<string>? availableCodes = null)
    {
        var allowed = new HashSet<string>(availableCodes ?? All.Keys);
        return All.Values.Where(item => allowed.Contains(item.Code)).ToList();
    }
}
