import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../state/shell_controller.dart';
import '../theme/app_colors.dart';
import 'converter_screen.dart';
import 'history_screen.dart';
import 'rates_screen.dart';
import 'settings_screen.dart';

class RootShell extends StatelessWidget {
  const RootShell({super.key});

  @override
  Widget build(BuildContext context) {
    final shell = context.watch<ShellController>();

    return Scaffold(
      body: SafeArea(
        bottom: false,
        child: IndexedStack(
          index: shell.index,
          children: const [
            ConverterScreen(),
            RatesScreen(),
            HistoryScreen(),
            SettingsScreen(),
          ],
        ),
      ),
      bottomNavigationBar: DecoratedBox(
        decoration: const BoxDecoration(
          border: Border(top: BorderSide(color: AppColors.line)),
        ),
        child: NavigationBar(
          selectedIndex: shell.index,
          onDestinationSelected: context.read<ShellController>().goTo,
          destinations: const [
            NavigationDestination(
              icon: Icon(Icons.swap_horiz),
              label: 'Конвертер',
            ),
            NavigationDestination(
              icon: Icon(Icons.bar_chart),
              label: 'Курси',
            ),
            NavigationDestination(
              icon: Icon(Icons.history),
              label: 'Історія',
            ),
            NavigationDestination(
              icon: Icon(Icons.settings_outlined),
              selectedIcon: Icon(Icons.settings),
              label: 'Ще',
            ),
          ],
        ),
      ),
    );
  }
}
