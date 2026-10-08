import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../data/currencies.dart';
import '../models/currency_field.dart';
import '../models/history_entry.dart';
import '../navigation/routes.dart';
import '../state/converter_controller.dart';
import '../state/history_controller.dart';
import '../state/rates_controller.dart';
import '../state/settings_controller.dart';
import '../state/shell_controller.dart';
import '../theme/app_colors.dart';
import '../utils/format.dart';
import '../widgets/amount_input.dart';
import '../widgets/currency_button.dart';
import '../widgets/primary_button.dart';
import '../widgets/quick_amount_row.dart';
import '../widgets/screen_header.dart';

class ConverterScreen extends StatelessWidget {
  const ConverterScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final converter = context.watch<ConverterController>();
    final rates = context.watch<RatesController>();
    final settings = context.watch<SettingsController>();
    final numericAmount = parseAmount(converter.amount);
    final result =
        convertAmount(numericAmount, converter.from, converter.to, rates.rates);
    final rate = crossRate(converter.from, converter.to, rates.rates);

    final String subtitle;
    if (rates.status == LoadStatus.failed) {
      subtitle = rates.error ?? 'Невідома помилка завантаження курсів.';
    } else if (rates.status == LoadStatus.loading && rates.updatedAt == null) {
      subtitle = 'Завантаження курсів…';
    } else {
      subtitle = 'Оновлено ${formatUpdatedAt(rates.updatedAt)}';
    }

    return ListView(
      keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
      padding: const EdgeInsets.fromLTRB(
          AppSpacing.screen, 8, AppSpacing.screen, 36),
      children: [
        ScreenHeader(
            kicker: 'Live rates', title: 'Конвертер', subtitle: subtitle),
        AmountInput(
          value: converter.amount,
          code: converter.from,
          onChanged: context.read<ConverterController>().setAmount,
        ),
        const SizedBox(height: 12),
        QuickAmountRow(onSelect: context.read<ConverterController>().setAmount),
        const SizedBox(height: 18),
        CurrencyButton(
          code: converter.from,
          label: 'З валюти',
          onPressed: () => openCurrencyPicker(context, CurrencyField.from),
        ),
        const SizedBox(height: 10),
        Center(
          child: Semantics(
            button: true,
            label: 'Поміняти валюти місцями',
            child: Material(
              color: AppColors.mint,
              shape: const CircleBorder(),
              child: InkWell(
                customBorder: const CircleBorder(),
                onTap: context.read<ConverterController>().swap,
                child: const SizedBox(
                  width: 44,
                  height: 44,
                  child: Icon(Icons.swap_vert, color: AppColors.bg, size: 20),
                ),
              ),
            ),
          ),
        ),
        const SizedBox(height: 10),
        CurrencyButton(
          code: converter.to,
          label: 'У валюту',
          onPressed: () => openCurrencyPicker(context, CurrencyField.to),
        ),
        const SizedBox(height: 18),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: AppColors.mintDeep,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: AppColors.line),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Результат',
                style: TextStyle(
                  color: AppColors.muted,
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 6),
              FittedBox(
                fit: BoxFit.scaleDown,
                alignment: Alignment.centerLeft,
                child: Text(
                  result == null
                      ? '—'
                      : formatAmount(result, settings.decimals),
                  style: const TextStyle(
                    color: AppColors.mint,
                    fontSize: 40,
                    fontWeight: FontWeight.w300,
                  ),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                '1 ${converter.from} = ${rate == null ? '—' : formatRate(rate)} ${converter.to}',
                style: const TextStyle(color: AppColors.text, fontSize: 14),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        PrimaryButton(
          label: 'Зберегти в історію',
          enabled: result != null && numericAmount > 0,
          onPressed: () => _save(
            context,
            numericAmount: numericAmount,
            result: result,
            rate: rate,
          ),
        ),
        const SizedBox(height: 22),
        const Text('Популярні пари', style: AppText.cardTitle),
        const SizedBox(height: 10),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            for (final code
                in popularCodes.where((item) => item != converter.from).take(4))
              Material(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(12),
                child: InkWell(
                  onTap: () => context.read<ConverterController>().setPair(
                        from: converter.from,
                        to: code,
                      ),
                  borderRadius: BorderRadius.circular(12),
                  child: Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.line),
                    ),
                    child: Text(
                      '${converter.from} → $code',
                      style: const TextStyle(
                        color: AppColors.text,
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ],
    );
  }

  void _save(
    BuildContext context, {
    required double numericAmount,
    required double? result,
    required double? rate,
  }) {
    if (result == null || rate == null || numericAmount <= 0) {
      return;
    }
    final converter = context.read<ConverterController>();
    final settings = context.read<SettingsController>();
    final createdAt = DateTime.now().toUtc().toIso8601String();
    context.read<HistoryController>().add(
          HistoryEntry(
            id: DateTime.now().microsecondsSinceEpoch.toString(),
            from: converter.from,
            to: converter.to,
            amount: numericAmount,
            result: result,
            rate: rate,
            amountLabel: formatAmount(numericAmount, settings.decimals),
            resultLabel: formatAmount(result, settings.decimals),
            rateLabel: formatRate(rate),
            createdAt: createdAt,
            createdAtLabel: formatUpdatedAt(createdAt),
          ),
        );
    context.read<ShellController>().goTo(ShellController.history);
  }
}
