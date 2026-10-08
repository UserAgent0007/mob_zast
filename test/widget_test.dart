import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:currency_converter/api/rates_api.dart';
import 'package:currency_converter/app.dart';
import 'package:currency_converter/state/converter_controller.dart';
import 'package:currency_converter/state/history_controller.dart';
import 'package:currency_converter/state/rates_controller.dart';
import 'package:currency_converter/state/settings_controller.dart';
import 'package:currency_converter/state/shell_controller.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:provider/provider.dart';

void main() {
  testWidgets('converter tab is shown on launch', (tester) async {
    final api = RatesApi(
      client: MockClient((request) async {
        return http.Response(
          jsonEncode({
            'result': 'success',
            'base_code': 'USD',
            'time_last_update_utc': '2026-10-07T00:00:00Z',
            'rates': {'USD': 1, 'UAH': 40, 'EUR': 0.9, 'PLN': 3.7, 'GBP': 0.75},
          }),
          200,
        );
      }),
    );

    tester.view.physicalSize = const Size(1200, 2400);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => RatesController(api)),
          ChangeNotifierProvider(create: (_) => ConverterController()),
          ChangeNotifierProvider(create: (_) => HistoryController()),
          ChangeNotifierProvider(create: (_) => SettingsController()),
          ChangeNotifierProvider(create: (_) => ShellController()),
        ],
        child: const CurrencyApp(),
      ),
    );
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 50));

    expect(find.text('Конвертер'), findsWidgets);
    expect(find.text('Курси'), findsOneWidget);
    expect(find.text('1000'), findsWidgets);
    expect(find.text('Зберегти в історію'), findsOneWidget);
    expect(find.text('25,00'), findsOneWidget);
  });
}
