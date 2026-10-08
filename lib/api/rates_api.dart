import 'dart:async';
import 'dart:convert';

import 'package:http/http.dart' as http;

import '../models/rate_snapshot.dart';

class RatesException implements Exception {
  const RatesException(this.message);

  final String message;

  @override
  String toString() => message;
}

class RatesApi {
  RatesApi({http.Client? client}) : _client = client;

  static const endpoint = 'https://open.er-api.com/v6/latest';

  final http.Client? _client;

  Future<RateSnapshot> fetchLatest([String base = 'USD']) async {
    final uri = Uri.parse('$endpoint/${Uri.encodeComponent(base)}');
    final http.Response response;
    try {
      response = await _get(uri).timeout(const Duration(seconds: 20));
    } on TimeoutException {
      throw const RatesException(
          'Немає з’єднання з сервісом курсів. Перевірте мережу.');
    } on Exception {
      throw const RatesException(
          'Немає з’єднання з сервісом курсів. Перевірте мережу.');
    }

    if (response.statusCode != 200) {
      throw const RatesException('Сервіс курсів тимчасово недоступний.');
    }

    final Object? decoded;
    try {
      decoded = jsonDecode(response.body);
    } on FormatException {
      throw const RatesException(
          'Не вдалося прочитати відповідь сервісу курсів.');
    }
    if (decoded is! Map) {
      throw const RatesException(
          'Не вдалося прочитати відповідь сервісу курсів.');
    }

    final data = Map<String, dynamic>.from(decoded);
    final rawRates = data['rates'];
    if (data['result'] != 'success' || rawRates is! Map) {
      throw const RatesException(
          'Не вдалося прочитати відповідь сервісу курсів.');
    }

    final rates = <String, double>{};
    rawRates.forEach((key, value) {
      if (value is num) {
        rates[key.toString()] = value.toDouble();
      }
    });
    if (rates.isEmpty) {
      throw const RatesException(
          'Не вдалося прочитати відповідь сервісу курсів.');
    }

    return RateSnapshot(
      base: data['base_code'] as String? ?? base,
      rates: rates,
      updatedAt: data['time_last_update_utc'] as String? ??
          DateTime.now().toUtc().toIso8601String(),
      provider: 'ExchangeRate-API',
    );
  }

  Future<http.Response> _get(Uri uri) {
    const headers = {'Accept': 'application/json'};
    final client = _client;
    if (client == null) {
      return http.get(uri, headers: headers);
    }
    return client.get(uri, headers: headers);
  }
}
