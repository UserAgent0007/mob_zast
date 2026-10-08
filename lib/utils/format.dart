String amountToInput(Object amount) {
  if (amount is num) {
    final value = amount.toDouble();
    if (!value.isFinite) {
      return '0';
    }
    if (value == value.roundToDouble()) {
      return value.toInt().toString();
    }
    return value.toString();
  }
  return amount.toString();
}

double parseAmount(String? value) {
  final normalized =
      (value ?? '').replaceAll(',', '.').replaceAll(RegExp(r'[^\d.]'), '');
  if (normalized.isEmpty || normalized == '.') {
    return 0;
  }
  final match = RegExp(r'^\d*\.?\d*').stringMatch(normalized) ?? '';
  if (match.isEmpty || match == '.') {
    return 0;
  }
  return double.tryParse(match) ?? 0;
}

String formatAmount(double? value, [int decimals = 2]) {
  if (value == null || !value.isFinite) {
    return '—';
  }
  return _formatFixed(value, minDecimals: decimals, maxDecimals: decimals);
}

String formatRate(double? value) {
  if (value == null || !value.isFinite) {
    return '—';
  }
  final maxDecimals = value.abs() >= 1 ? 4 : 6;
  return _formatFixed(value, minDecimals: 2, maxDecimals: maxDecimals);
}

DateTime? tryParseUpdatedAt(String raw) {
  final iso = DateTime.tryParse(raw);
  if (iso != null) {
    return iso.toLocal();
  }

  final match = RegExp(
    r'(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})\s+(\d{2}):(\d{2})',
  ).firstMatch(raw);
  if (match == null) {
    return null;
  }

  const months = {
    'Jan': 1,
    'Feb': 2,
    'Mar': 3,
    'Apr': 4,
    'May': 5,
    'Jun': 6,
    'Jul': 7,
    'Aug': 8,
    'Sep': 9,
    'Oct': 10,
    'Nov': 11,
    'Dec': 12,
  };
  final month = months[match.group(2)];
  if (month == null) {
    return null;
  }

  return DateTime.utc(
    int.parse(match.group(3)!),
    month,
    int.parse(match.group(1)!),
    int.parse(match.group(4)!),
    int.parse(match.group(5)!),
  ).toLocal();
}

String formatUpdatedAt(String? raw) {
  if (raw == null || raw.isEmpty) {
    return 'ще не оновлено';
  }
  final date = tryParseUpdatedAt(raw);
  if (date == null) {
    return raw;
  }

  const months = [
    'січ.',
    'лют.',
    'бер.',
    'квіт.',
    'трав.',
    'черв.',
    'лип.',
    'серп.',
    'вер.',
    'жовт.',
    'лист.',
    'груд.',
  ];
  final day = date.day.toString().padLeft(2, '0');
  final hour = date.hour.toString().padLeft(2, '0');
  final minute = date.minute.toString().padLeft(2, '0');
  return '$day ${months[date.month - 1]}, $hour:$minute';
}

double? convertAmount(
  double amount,
  String from,
  String to,
  Map<String, double> rates,
) {
  final fromRate = rates[from];
  final toRate = rates[to];
  if (fromRate == null || toRate == null || fromRate == 0 || toRate == 0) {
    return null;
  }
  return amount * toRate / fromRate;
}

double? crossRate(String from, String to, Map<String, double> rates) {
  final fromRate = rates[from];
  final toRate = rates[to];
  if (fromRate == null || toRate == null || fromRate == 0 || toRate == 0) {
    return null;
  }
  return toRate / fromRate;
}

String _formatFixed(
  double value, {
  required int minDecimals,
  required int maxDecimals,
}) {
  final negative = value < 0;
  final pieces = value.abs().toStringAsFixed(maxDecimals).split('.');
  var fraction = pieces.length > 1 ? pieces[1] : '';
  while (fraction.length > minDecimals && fraction.endsWith('0')) {
    fraction = fraction.substring(0, fraction.length - 1);
  }
  final grouped = _groupThousands(pieces[0]);
  final body = fraction.isEmpty ? grouped : '$grouped,$fraction';
  return negative ? '-$body' : body;
}

String _groupThousands(String digits) {
  final buffer = StringBuffer();
  for (var i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 == 0) {
      buffer.write('\u00A0');
    }
    buffer.write(digits[i]);
  }
  return buffer.toString();
}
