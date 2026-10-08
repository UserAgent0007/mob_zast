import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../data/currencies.dart';
import '../state/converter_controller.dart';
import '../state/rates_controller.dart';
import '../state/settings_controller.dart';
import '../state/shell_controller.dart';
import '../theme/app_colors.dart';
import '../utils/format.dart';
import '../widgets/primary_button.dart';

class RateDetailsScreen extends StatelessWidget {
  const RateDetailsScreen({super.key, required this.from, required this.to});

  final String from;
  final String to;

  static const _samples = [1, 10, 100, 1000];

  @override
  Widget build(BuildContext context) {
    final rates = context.watch<RatesController>().rates;
    final decimals = context.watch<SettingsController>().decimals;
    final favorites = context.watch<SettingsController>().favorites;
    final fromCurrency = getCurrency(from);
    final toCurrency = getCurrency(to);
    final rate = crossRate(from, to, rates);
    final inverse = crossRate(to, from, rates);
    final favorite = favorites.contains(to);

    return Scaffold(
      appBar: AppBar(title: const Text('Деталі курсу')),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(
            AppSpacing.screen, 8, AppSpacing.screen, 36),
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.mintDeep,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.line),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${fromCurrency.code} → ${toCurrency.code}',
                  style: const TextStyle(
                    color: AppColors.text,
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  rate == null ? '—' : formatRate(rate),
                  style: const TextStyle(
                    color: AppColors.mint,
                    fontSize: 40,
                    fontWeight: FontWeight.w300,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  '1 ${fromCurrency.name} = ${rate == null ? '—' : formatRate(rate)} ${toCurrency.name}',
                  style: const TextStyle(color: AppColors.muted, height: 1.4),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          _Card(
            title: 'Обернений курс',
            child: Text(
              '1 $to = ${inverse == null ? '—' : formatRate(inverse)} $from',
              style: const TextStyle(
                color: AppColors.mint,
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          const SizedBox(height: 12),
          _Card(
            title: 'Швидкі суми',
            child: Column(
              children: [
                for (final amount in _samples)
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          '${formatAmount(amount.toDouble(), 0)} $from',
                          style: const TextStyle(color: AppColors.muted),
                        ),
                        Text(
                          '${_converted(amount.toDouble(), rates, decimals)} $to',
                          style: const TextStyle(
                            color: AppColors.text,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          PrimaryButton(
            label: 'Відкрити в конвертері',
            onPressed: () {
              context
                  .read<ConverterController>()
                  .setPair(from: from, to: to, amount: '1');
              context.read<ShellController>().goTo(ShellController.converter);
              Navigator.of(context).pop();
            },
          ),
          const SizedBox(height: 10),
          PrimaryButton(
            label: favorite ? 'Прибрати з обраного' : 'Додати в обране',
            variant: ButtonVariant.ghost,
            onPressed: () =>
                context.read<SettingsController>().toggleFavorite(to),
          ),
        ],
      ),
    );
  }

  String _converted(double amount, Map<String, double> rates, int decimals) {
    final value = convertAmount(amount, from, to, rates);
    if (value == null) {
      return '—';
    }
    return formatAmount(value, decimals);
  }
}

class _Card extends StatelessWidget {
  const _Card({required this.title, required this.child});

  final String title;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.line),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: AppText.cardTitle),
          const SizedBox(height: 10),
          child,
        ],
      ),
    );
  }
}
