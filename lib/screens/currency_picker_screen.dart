import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../data/currencies.dart';
import '../models/currency_field.dart';
import '../state/converter_controller.dart';
import '../state/rates_controller.dart';
import '../state/settings_controller.dart';
import '../theme/app_colors.dart';
import '../widgets/currency_mark.dart';
import '../widgets/empty_state.dart';
import '../widgets/search_field.dart';

class CurrencyPickerScreen extends StatefulWidget {
  const CurrencyPickerScreen({super.key, required this.field});

  final CurrencyField field;

  @override
  State<CurrencyPickerScreen> createState() => _CurrencyPickerScreenState();
}

class _CurrencyPickerScreenState extends State<CurrencyPickerScreen> {
  String _query = '';

  @override
  Widget build(BuildContext context) {
    final rates = context.watch<RatesController>().rates;
    final favorites = context.watch<SettingsController>().favorites;
    final items = _items(rates, favorites);

    return Scaffold(
      appBar: AppBar(title: const Text('Обрати валюту')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(AppSpacing.screen),
            child: SearchField(
              hint: 'Код або назва валюти',
              autofocus: true,
              capitalization: TextCapitalization.characters,
              onChanged: (value) => setState(() => _query = value),
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.fromLTRB(
                  AppSpacing.screen, 0, AppSpacing.screen, 24),
              itemCount: items.isEmpty ? 1 : items.length,
              itemBuilder: (context, index) {
                if (items.isEmpty) {
                  return const EmptyState(
                    icon: Icons.search_off,
                    title: 'Валюту не знайдено',
                  );
                }
                final item = items[index];
                final favorite = favorites.contains(item.code);
                return InkWell(
                  onTap: () => _apply(item.code),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    decoration: const BoxDecoration(
                      border: Border(bottom: BorderSide(color: AppColors.line)),
                    ),
                    child: Row(
                      children: [
                        CurrencyMark(code: item.code, size: 36),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                item.code,
                                style: const TextStyle(
                                  color: AppColors.text,
                                  fontSize: 16,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                item.name,
                                style: const TextStyle(
                                    color: AppColors.muted, fontSize: 13),
                              ),
                            ],
                          ),
                        ),
                        IconButton(
                          onPressed: () => context
                              .read<SettingsController>()
                              .toggleFavorite(item.code),
                          icon: Icon(
                            favorite ? Icons.star : Icons.star_border,
                            size: 18,
                            color:
                                favorite ? AppColors.warning : AppColors.muted,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  List<CurrencyInfo> _items(Map<String, double> rates, List<String> favorites) {
    final known = listKnownCurrencies(rates.isEmpty ? null : rates.keys);
    final needle = _query.trim().toLowerCase();
    final items = [
      for (final item in known)
        if (needle.isEmpty ||
            item.code.toLowerCase().contains(needle) ||
            item.name.toLowerCase().contains(needle))
          item,
    ];
    items.sort((left, right) {
      final leftFavorite = favorites.contains(left.code);
      final rightFavorite = favorites.contains(right.code);
      if (leftFavorite != rightFavorite) {
        return leftFavorite ? -1 : 1;
      }
      return left.code.compareTo(right.code);
    });
    return items;
  }

  void _apply(String code) {
    final converter = context.read<ConverterController>();
    if (widget.field == CurrencyField.from) {
      converter.setFrom(code);
    } else if (widget.field == CurrencyField.to) {
      converter.setTo(code);
    } else {
      context.read<SettingsController>().setDisplayBase(code);
    }
    Navigator.of(context).pop();
  }
}
