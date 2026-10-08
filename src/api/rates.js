const ENDPOINT = 'https://open.er-api.com/v6/latest';

export async function fetchLatestRates(base = 'USD') {
  let response;
  try {
    response = await fetch(`${ENDPOINT}/${encodeURIComponent(base)}`);
  } catch {
    throw new Error('Немає з’єднання з сервісом курсів. Перевірте мережу.');
  }

  if (!response.ok) {
    throw new Error('Сервіс курсів тимчасово недоступний.');
  }

  const data = await response.json();
  if (data.result !== 'success' || !data.rates) {
    throw new Error('Не вдалося прочитати відповідь сервісу курсів.');
  }

  return {
    base: data.base_code || base,
    rates: data.rates,
    updatedAt: data.time_last_update_utc || new Date().toISOString(),
    provider: 'ExchangeRate-API',
  };
}
