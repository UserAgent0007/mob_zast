import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../data/currencies.dart';
import '../models/currency_field.dart';
import '../navigation/routes.dart';
import '../state/rates_controller.dart';
import '../state/settings_controller.dart';
import '../theme/app_colors.dart';
import '../utils/format.dart';
import '../widgets/app_card.dart';
import '../widgets/primary_button.dart';
import '../widgets/screen_header.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  static const _decimalOptions = [2, 4, 6];

  @override
  Widget build(BuildContext context) {
    final settings = context.watch<SettingsController>();
    final rates = context.watch<RatesController>();
    final base = getCurrency(settings.displayBase);
    final loading = rates.status == LoadStatus.loading;

    return ListView(
      padding: const EdgeInsets.fromLTRB(
          AppSpacing.screen, 8, AppSpacing.screen, 36),
      children: [
        const ScreenHeader(
          kicker: 'Профіль',
          title: 'Налаштування',
          subtitle: 'Точність, базова валюта та обране',
        ),
        AppCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Знаків після коми', style: AppText.cardTitle),
              const SizedBox(height: 12),
              Row(
                children: [
                  for (final value in _decimalOptions) ...[
                    if (value != _decimalOptions.first)
                      const SizedBox(width: 8),
                    Expanded(
                      child: _DecimalOption(
                        value: value,
                        active: settings.decimals == value,
                        onPressed: () => context
                            .read<SettingsController>()
                            .setDecimals(value),
                      ),
                    ),
                  ],
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        AppCard(
          onTap: () => openCurrencyPicker(context, CurrencyField.base),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('База для таблиці курсів', style: AppText.cardTitle),
              const SizedBox(height: 8),
              Text(
                '${base.code} · ${base.name}',
                style: const TextStyle(
                  color: AppColors.mint,
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        AppCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Обрані валюти', style: AppText.cardTitle),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  for (final code in settings.favorites)
                    Material(
                      color: AppColors.mintDeep,
                      borderRadius: BorderRadius.circular(999),
                      child: InkWell(
                        onTap: () => context
                            .read<SettingsController>()
                            .toggleFavorite(code),
                        borderRadius: BorderRadius.circular(999),
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 8),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(999),
                            border: Border.all(color: AppColors.line),
                          ),
                          child: Text(
                            getCurrency(code).code,
                            style: const TextStyle(
                              color: AppColors.text,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 10),
              const Text(
                'Натисніть валюту, щоб прибрати її з обраного.',
                style: AppText.hint,
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        AppCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Джерело даних', style: AppText.cardTitle),
              const SizedBox(height: 8),
              Text(
                rates.provider.isEmpty ? 'ExchangeRate-API' : rates.provider,
                style: const TextStyle(
                  color: AppColors.mint,
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 10),
              Text(
                'Мережевий виклик: open.er-api.com. Останнє оновлення ${formatUpdatedAt(rates.updatedAt)}.',
                style: AppText.hint,
              ),
              if (rates.error != null) ...[
                const SizedBox(height: 8),
                Text(rates.error!,
                    style:
                        const TextStyle(color: AppColors.danger, fontSize: 13)),
              ],
              const SizedBox(height: 14),
              PrimaryButton(
                label: loading ? 'Оновлення…' : 'Оновити курси зараз',
                variant: ButtonVariant.accent,
                enabled: !loading,
                onPressed: () => context.read<RatesController>().load(),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        const AppCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Архітектура', style: AppText.cardTitle),
              SizedBox(height: 10),
              Text(
                'Provider зберігає курси, конвертер, історію та налаштування. Вкладки ведуть між розділами, а стек відкриває вибір валюти та деталі пари.',
                style: AppText.hint,
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _DecimalOption extends StatelessWidget {
  const _DecimalOption({
    required this.value,
    required this.active,
    required this.onPressed,
  });

  final int value;
  final bool active;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: active ? AppColors.mint : AppColors.surfaceRaised,
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        onTap: onPressed,
        borderRadius: BorderRadius.circular(12),
        child: SizedBox(
          height: 44,
          child: Center(
            child: Text(
              '$value',
              style: TextStyle(
                color: active ? AppColors.bg : AppColors.text,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
