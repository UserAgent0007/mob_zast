import 'package:currency_converter/models/history_entry.dart';
import 'package:currency_converter/state/converter_controller.dart';
import 'package:currency_converter/state/history_controller.dart';
import 'package:currency_converter/state/settings_controller.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('choosing the opposite currency swaps the pair', () {
    final converter = ConverterController();
    converter.setFrom('USD');
    expect(converter.from, 'USD');
    expect(converter.to, 'UAH');

    converter.setTo('UAH');
    expect(converter.from, 'USD');
    expect(converter.to, 'UAH');

    converter.swap();
    expect(converter.from, 'UAH');
    expect(converter.to, 'USD');
  });

  test('setPair can replace the amount', () {
    final converter = ConverterController();
    converter.setPair(from: 'EUR', to: 'PLN', amount: 50);
    expect(converter.from, 'EUR');
    expect(converter.to, 'PLN');
    expect(converter.amount, '50');
  });

  test('history keeps the newest 40 records', () {
    final history = HistoryController();
    for (var i = 0; i < 45; i++) {
      history.add(_entry('$i'));
    }
    expect(history.items, hasLength(40));
    expect(history.items.first.id, '44');
    expect(history.items.last.id, '5');

    history.remove('44');
    expect(history.items.any((item) => item.id == '44'), isFalse);

    history.clear();
    expect(history.items, isEmpty);
  });

  test('the last favorite currency stays', () {
    final settings = SettingsController();
    settings.favorites = ['USD'];
    settings.toggleFavorite('USD');
    expect(settings.favorites, ['USD']);

    settings.toggleFavorite('EUR');
    expect(settings.favorites, ['USD', 'EUR']);
    settings.toggleFavorite('USD');
    expect(settings.favorites, ['EUR']);
  });
}

HistoryEntry _entry(String id) {
  return HistoryEntry(
    id: id,
    from: 'UAH',
    to: 'USD',
    amount: 1,
    result: 0.025,
    rate: 0.025,
    amountLabel: '1,00',
    resultLabel: '0,03',
    rateLabel: '0,025',
    createdAt: '2026-10-07T00:00:00Z',
    createdAtLabel: '07 жовт., 03:00',
  );
}
