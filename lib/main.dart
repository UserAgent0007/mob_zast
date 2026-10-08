import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import 'api/rates_api.dart';
import 'app.dart';
import 'state/converter_controller.dart';
import 'state/history_controller.dart';
import 'state/rates_controller.dart';
import 'state/settings_controller.dart';
import 'state/shell_controller.dart';
import 'theme/app_colors.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: AppColors.bg,
      statusBarIconBrightness: Brightness.light,
      statusBarBrightness: Brightness.dark,
      systemNavigationBarColor: AppColors.surface,
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => RatesController(RatesApi())),
        ChangeNotifierProvider(create: (_) => ConverterController()),
        ChangeNotifierProvider(create: (_) => HistoryController()),
        ChangeNotifierProvider(create: (_) => SettingsController()),
        ChangeNotifierProvider(create: (_) => ShellController()),
      ],
      child: const CurrencyApp(),
    ),
  );
}
