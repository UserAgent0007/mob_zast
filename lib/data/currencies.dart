class CurrencyInfo {
  const CurrencyInfo({
    required this.code,
    required this.name,
    required this.flag,
    required this.symbol,
  });

  final String code;
  final String name;
  final String flag;
  final String symbol;
}

const currencies = <String, CurrencyInfo>{
  'UAH': CurrencyInfo(
      code: 'UAH', name: 'Українська гривня', flag: '🇺🇦', symbol: '₴'),
  'USD':
      CurrencyInfo(code: 'USD', name: 'Долар США', flag: '🇺🇸', symbol: r'$'),
  'EUR': CurrencyInfo(code: 'EUR', name: 'Євро', flag: '🇪🇺', symbol: '€'),
  'GBP': CurrencyInfo(
      code: 'GBP', name: 'Фунт стерлінгів', flag: '🇬🇧', symbol: '£'),
  'PLN': CurrencyInfo(
      code: 'PLN', name: 'Польський злотий', flag: '🇵🇱', symbol: 'zł'),
  'CZK': CurrencyInfo(
      code: 'CZK', name: 'Чеська крона', flag: '🇨🇿', symbol: 'Kč'),
  'CHF': CurrencyInfo(
      code: 'CHF', name: 'Швейцарський франк', flag: '🇨🇭', symbol: 'Fr'),
  'JPY': CurrencyInfo(
      code: 'JPY', name: 'Японська єна', flag: '🇯🇵', symbol: '¥'),
  'CAD': CurrencyInfo(
      code: 'CAD', name: 'Канадський долар', flag: '🇨🇦', symbol: r'C$'),
  'AUD': CurrencyInfo(
      code: 'AUD', name: 'Австралійський долар', flag: '🇦🇺', symbol: r'A$'),
  'CNY': CurrencyInfo(
      code: 'CNY', name: 'Китайський юань', flag: '🇨🇳', symbol: '¥'),
  'TRY': CurrencyInfo(
      code: 'TRY', name: 'Турецька ліра', flag: '🇹🇷', symbol: '₺'),
  'SEK': CurrencyInfo(
      code: 'SEK', name: 'Шведська крона', flag: '🇸🇪', symbol: 'kr'),
  'NOK': CurrencyInfo(
      code: 'NOK', name: 'Норвезька крона', flag: '🇳🇴', symbol: 'kr'),
  'DKK': CurrencyInfo(
      code: 'DKK', name: 'Данська крона', flag: '🇩🇰', symbol: 'kr'),
  'RON': CurrencyInfo(
      code: 'RON', name: 'Румунський лей', flag: '🇷🇴', symbol: 'lei'),
  'HUF': CurrencyInfo(
      code: 'HUF', name: 'Угорський форинт', flag: '🇭🇺', symbol: 'Ft'),
  'MDL': CurrencyInfo(
      code: 'MDL', name: 'Молдовський лей', flag: '🇲🇩', symbol: 'L'),
  'GEL': CurrencyInfo(
      code: 'GEL', name: 'Грузинський ларі', flag: '🇬🇪', symbol: '₾'),
  'ILS': CurrencyInfo(
      code: 'ILS', name: 'Ізраїльський шекель', flag: '🇮🇱', symbol: '₪'),
  'INR': CurrencyInfo(
      code: 'INR', name: 'Індійська рупія', flag: '🇮🇳', symbol: '₹'),
  'KRW': CurrencyInfo(
      code: 'KRW', name: 'Південнокорейська вона', flag: '🇰🇷', symbol: '₩'),
  'BRL': CurrencyInfo(
      code: 'BRL', name: 'Бразильський реал', flag: '🇧🇷', symbol: r'R$'),
  'MXN': CurrencyInfo(
      code: 'MXN', name: 'Мексиканське песо', flag: '🇲🇽', symbol: r'Mex$'),
  'SGD': CurrencyInfo(
      code: 'SGD', name: 'Сінгапурський долар', flag: '🇸🇬', symbol: r'S$'),
  'NZD': CurrencyInfo(
      code: 'NZD', name: 'Новозеландський долар', flag: '🇳🇿', symbol: r'NZ$'),
  'AED': CurrencyInfo(
      code: 'AED', name: 'Дирхам ОАЕ', flag: '🇦🇪', symbol: 'د.إ'),
  'KZT': CurrencyInfo(
      code: 'KZT', name: 'Казахстанський тенге', flag: '🇰🇿', symbol: '₸'),
  'BGN': CurrencyInfo(
      code: 'BGN', name: 'Болгарський лев', flag: '🇧🇬', symbol: 'лв'),
};

const popularCodes = ['UAH', 'USD', 'EUR', 'PLN', 'GBP', 'CZK', 'CHF'];

const quickAmounts = [1, 10, 50, 100, 500, 1000];

const defaultFavorites = ['UAH', 'USD', 'EUR', 'PLN', 'GBP'];

CurrencyInfo getCurrency(String code) {
  return currencies[code] ??
      CurrencyInfo(code: code, name: code, flag: '💱', symbol: code);
}

List<CurrencyInfo> listKnownCurrencies([Iterable<String>? availableCodes]) {
  final allowed = availableCodes?.toSet() ?? currencies.keys.toSet();
  return currencies.values
      .where((item) => allowed.contains(item.code))
      .toList();
}
