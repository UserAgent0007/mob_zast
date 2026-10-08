import 'package:currency_converter/utils/format.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  const rates = {'USD': 1.0, 'UAH': 40.0, 'EUR': 0.9};

  test('parseAmount accepts comma and ignores extra symbols', () {
    expect(parseAmount('1 000,50'), 1000.5);
    expect(parseAmount(''), 0);
    expect(parseAmount('.'), 0);
    expect(parseAmount('1.2.3'), 1.2);
  });

  test('formatAmount uses Ukrainian separators', () {
    expect(formatAmount(1000, 2), '1\u00A0000,00');
    expect(formatAmount(25, 0), '25');
    expect(formatAmount(null, 2), '—');
  });

  test('formatRate keeps at least two fraction digits', () {
    expect(formatRate(1.5), '1,50');
    expect(formatRate(41.123456), '41,1235');
    expect(formatRate(0.025), '0,025');
    expect(formatRate(null), '—');
  });

  test('cross rate and conversion go through the dollar base', () {
    expect(crossRate('UAH', 'USD', rates), 0.025);
    expect(convertAmount(1000, 'UAH', 'USD', rates), 25);
    expect(convertAmount(10, 'USD', 'EUR', rates), 9);
    expect(convertAmount(10, 'USD', 'GBP', rates), isNull);
  });

  test('amountToInput drops a trailing .0', () {
    expect(amountToInput(1000), '1000');
    expect(amountToInput(10.5), '10.5');
  });

  test('api date is parsed as UTC', () {
    final parsed = tryParseUpdatedAt('Wed, 07 Oct 2026 00:02:31 +0000');
    expect(parsed, isNotNull);
    final utc = parsed!.toUtc();
    expect(utc.year, 2026);
    expect(utc.month, 10);
    expect(utc.day, 7);
    expect(utc.hour, 0);
    expect(utc.minute, 2);
  });

  test('missing date has a fallback label', () {
    expect(formatUpdatedAt(null), 'ще не оновлено');
    expect(formatUpdatedAt('не дата'), 'не дата');
  });
}
