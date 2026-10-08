export const CURRENCIES = {
  UAH: { code: 'UAH', name: 'Українська гривня', flag: '🇺🇦', symbol: '₴' },
  USD: { code: 'USD', name: 'Долар США', flag: '🇺🇸', symbol: '$' },
  EUR: { code: 'EUR', name: 'Євро', flag: '🇪🇺', symbol: '€' },
  GBP: { code: 'GBP', name: 'Фунт стерлінгів', flag: '🇬🇧', symbol: '£' },
  PLN: { code: 'PLN', name: 'Польський злотий', flag: '🇵🇱', symbol: 'zł' },
  CZK: { code: 'CZK', name: 'Чеська крона', flag: '🇨🇿', symbol: 'Kč' },
  CHF: { code: 'CHF', name: 'Швейцарський франк', flag: '🇨🇭', symbol: 'Fr' },
  JPY: { code: 'JPY', name: 'Японська єна', flag: '🇯🇵', symbol: '¥' },
  CAD: { code: 'CAD', name: 'Канадський долар', flag: '🇨🇦', symbol: 'C$' },
  AUD: { code: 'AUD', name: 'Австралійський долар', flag: '🇦🇺', symbol: 'A$' },
  CNY: { code: 'CNY', name: 'Китайський юань', flag: '🇨🇳', symbol: '¥' },
  TRY: { code: 'TRY', name: 'Турецька ліра', flag: '🇹🇷', symbol: '₺' },
  SEK: { code: 'SEK', name: 'Шведська крона', flag: '🇸🇪', symbol: 'kr' },
  NOK: { code: 'NOK', name: 'Норвезька крона', flag: '🇳🇴', symbol: 'kr' },
  DKK: { code: 'DKK', name: 'Данська крона', flag: '🇩🇰', symbol: 'kr' },
  RON: { code: 'RON', name: 'Румунський лей', flag: '🇷🇴', symbol: 'lei' },
  HUF: { code: 'HUF', name: 'Угорський форинт', flag: '🇭🇺', symbol: 'Ft' },
  MDL: { code: 'MDL', name: 'Молдовський лей', flag: '🇲🇩', symbol: 'L' },
  GEL: { code: 'GEL', name: 'Грузинський ларі', flag: '🇬🇪', symbol: '₾' },
  ILS: { code: 'ILS', name: 'Ізраїльський шекель', flag: '🇮🇱', symbol: '₪' },
  INR: { code: 'INR', name: 'Індійська рупія', flag: '🇮🇳', symbol: '₹' },
  KRW: { code: 'KRW', name: 'Південнокорейська вона', flag: '🇰🇷', symbol: '₩' },
  BRL: { code: 'BRL', name: 'Бразильський реал', flag: '🇧🇷', symbol: 'R$' },
  MXN: { code: 'MXN', name: 'Мексиканське песо', flag: '🇲🇽', symbol: 'Mex$' },
  SGD: { code: 'SGD', name: 'Сінгапурський долар', flag: '🇸🇬', symbol: 'S$' },
  NZD: { code: 'NZD', name: 'Новозеландський долар', flag: '🇳🇿', symbol: 'NZ$' },
  AED: { code: 'AED', name: 'Дирхам ОАЕ', flag: '🇦🇪', symbol: 'د.إ' },
  KZT: { code: 'KZT', name: 'Казахстанський тенге', flag: '🇰🇿', symbol: '₸' },
  BGN: { code: 'BGN', name: 'Болгарський лев', flag: '🇧🇬', symbol: 'лв' },
};

export const POPULAR_CODES = ['UAH', 'USD', 'EUR', 'PLN', 'GBP', 'CZK', 'CHF'];

export const QUICK_AMOUNTS = [1, 10, 50, 100, 500, 1000];

export const DEFAULT_FAVORITES = ['UAH', 'USD', 'EUR', 'PLN', 'GBP'];

export function getCurrency(code) {
  return (
    CURRENCIES[code] || {
      code,
      name: code,
      flag: '💱',
      symbol: code,
    }
  );
}

export function listKnownCurrencies(availableCodes) {
  const allowed = new Set(availableCodes || Object.keys(CURRENCIES));
  return Object.values(CURRENCIES).filter((item) => allowed.has(item.code));
}
