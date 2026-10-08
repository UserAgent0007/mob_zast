package ua.lab5.currency.data

val CURRENCIES: Map<String, Currency> = listOf(
    Currency("UAH", "Українська гривня", "🇺🇦", "₴"),
    Currency("USD", "Долар США", "🇺🇸", "$"),
    Currency("EUR", "Євро", "🇪🇺", "€"),
    Currency("GBP", "Фунт стерлінгів", "🇬🇧", "£"),
    Currency("PLN", "Польський злотий", "🇵🇱", "zł"),
    Currency("CZK", "Чеська крона", "🇨🇿", "Kč"),
    Currency("CHF", "Швейцарський франк", "🇨🇭", "Fr"),
    Currency("JPY", "Японська єна", "🇯🇵", "¥"),
    Currency("CAD", "Канадський долар", "🇨🇦", "C$"),
    Currency("AUD", "Австралійський долар", "🇦🇺", "A$"),
    Currency("CNY", "Китайський юань", "🇨🇳", "¥"),
    Currency("TRY", "Турецька ліра", "🇹🇷", "₺"),
    Currency("SEK", "Шведська крона", "🇸🇪", "kr"),
    Currency("NOK", "Норвезька крона", "🇳🇴", "kr"),
    Currency("DKK", "Данська крона", "🇩🇰", "kr"),
    Currency("RON", "Румунський лей", "🇷🇴", "lei"),
    Currency("HUF", "Угорський форинт", "🇭🇺", "Ft"),
    Currency("MDL", "Молдовський лей", "🇲🇩", "L"),
    Currency("GEL", "Грузинський ларі", "🇬🇪", "₾"),
    Currency("ILS", "Ізраїльський шекель", "🇮🇱", "₪"),
    Currency("INR", "Індійська рупія", "🇮🇳", "₹"),
    Currency("KRW", "Південнокорейська вона", "🇰🇷", "₩"),
    Currency("BRL", "Бразильський реал", "🇧🇷", "R$"),
    Currency("MXN", "Мексиканське песо", "🇲🇽", "Mex$"),
    Currency("SGD", "Сінгапурський долар", "🇸🇬", "S$"),
    Currency("NZD", "Новозеландський долар", "🇳🇿", "NZ$"),
    Currency("AED", "Дирхам ОАЕ", "🇦🇪", "د.إ"),
    Currency("KZT", "Казахстанський тенге", "🇰🇿", "₸"),
    Currency("BGN", "Болгарський лев", "🇧🇬", "лв"),
).associateBy { it.code }

val POPULAR_CODES = listOf("UAH", "USD", "EUR", "PLN", "GBP", "CZK", "CHF")

val QUICK_AMOUNTS = listOf(1, 10, 50, 100, 500, 1000)

val DEFAULT_FAVORITES = listOf("UAH", "USD", "EUR", "PLN", "GBP")

val DECIMAL_OPTIONS = listOf(2, 4, 6)

fun currencyOf(code: String): Currency {
    return CURRENCIES[code] ?: Currency(code, code, "💱", code)
}

fun listKnownCurrencies(available: Collection<String>? = null): List<Currency> {
    val allowed = available?.toSet() ?: CURRENCIES.keys
    return CURRENCIES.values.filter { it.code in allowed }
}
