import 'package:flutter/foundation.dart';

import '../api/rates_api.dart';
import '../models/rate_snapshot.dart';

enum LoadStatus { idle, loading, succeeded, failed }

class RatesController extends ChangeNotifier {
  RatesController(this._api);

  final RatesApi _api;
  bool _disposed = false;

  String base = 'USD';
  Map<String, double> rates = {};
  String? updatedAt;
  String provider = '';
  LoadStatus status = LoadStatus.idle;
  String? error;

  Future<void> load([String base = 'USD']) async {
    status = LoadStatus.loading;
    error = null;
    _notify();

    try {
      final RateSnapshot snapshot = await _api.fetchLatest(base);
      this.base = snapshot.base;
      rates = snapshot.rates;
      updatedAt = snapshot.updatedAt;
      provider = snapshot.provider;
      status = LoadStatus.succeeded;
    } on RatesException catch (exception) {
      status = LoadStatus.failed;
      error = exception.message;
    } catch (_) {
      status = LoadStatus.failed;
      error = 'Невідома помилка завантаження курсів.';
    }
    _notify();
  }

  void _notify() {
    if (!_disposed) {
      notifyListeners();
    }
  }

  @override
  void dispose() {
    _disposed = true;
    super.dispose();
  }
}
