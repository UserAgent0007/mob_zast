import 'dart:convert';

import 'package:currency_converter/api/rates_api.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

void main() {
  test('fetchLatest reads a successful payload', () async {
    final api = RatesApi(
      client: MockClient((request) async {
        expect(request.url.path, endsWith('/USD'));
        return http.Response(
          jsonEncode({
            'result': 'success',
            'base_code': 'USD',
            'time_last_update_utc': 'Wed, 07 Oct 2026 00:02:31 +0000',
            'rates': {'USD': 1, 'UAH': 41.2},
          }),
          200,
        );
      }),
    );

    final snapshot = await api.fetchLatest();
    expect(snapshot.base, 'USD');
    expect(snapshot.provider, 'ExchangeRate-API');
    expect(snapshot.rates['UAH'], 41.2);
    expect(snapshot.updatedAt, contains('2026'));
  });

  test('fetchLatest reports an unavailable service', () async {
    final api = RatesApi(
      client: MockClient((request) async => http.Response('nope', 503)),
    );

    expect(
      api.fetchLatest(),
      throwsA(
        isA<RatesException>().having(
          (error) => error.message,
          'message',
          'Сервіс курсів тимчасово недоступний.',
        ),
      ),
    );
  });

  test('fetchLatest reports a network failure', () async {
    final api = RatesApi(
      client: MockClient((request) async {
        throw http.ClientException('offline');
      }),
    );

    expect(
      api.fetchLatest(),
      throwsA(
        isA<RatesException>().having(
          (error) => error.message,
          'message',
          'Немає з’єднання з сервісом курсів. Перевірте мережу.',
        ),
      ),
    );
  });
}
