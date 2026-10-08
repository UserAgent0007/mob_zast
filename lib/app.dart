import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'screens/root_shell.dart';
import 'state/rates_controller.dart';
import 'theme/app_theme.dart';

class CurrencyApp extends StatefulWidget {
  const CurrencyApp({super.key});

  @override
  State<CurrencyApp> createState() => _CurrencyAppState();
}

class _CurrencyAppState extends State<CurrencyApp> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) {
        return;
      }
      context.read<RatesController>().load();
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Конвертер валют',
      debugShowCheckedModeBanner: false,
      theme: buildAppTheme(),
      home: const RootShell(),
    );
  }
}
