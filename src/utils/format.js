export function parseAmount(value) {
  const normalized = String(value ?? '')
    .replace(',', '.')
    .replace(/[^\d.]/g, '');
  if (!normalized || normalized === '.') {
    return 0;
  }
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatAmount(value, decimals = 2) {
  if (value == null || !Number.isFinite(value)) {
    return '—';
  }
  return value.toLocaleString('uk-UA', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatRate(value) {
  if (!Number.isFinite(value)) {
    return '—';
  }
  const decimals = value >= 1 ? 4 : 6;
  return value.toLocaleString('uk-UA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  });
}

export function formatUpdatedAt(isoDate) {
  if (!isoDate) {
    return 'ще не оновлено';
  }
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }
  return date.toLocaleString('uk-UA', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function convertAmount(amount, from, to, rates) {
  const fromRate = rates?.[from];
  const toRate = rates?.[to];
  if (!fromRate || !toRate) {
    return null;
  }
  return (amount * toRate) / fromRate;
}

export function crossRate(from, to, rates) {
  const fromRate = rates?.[from];
  const toRate = rates?.[to];
  if (!fromRate || !toRate) {
    return null;
  }
  return toRate / fromRate;
}
