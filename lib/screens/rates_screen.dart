import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../data/currencies.dart';
import '../models/currency_field.dart';
import '../navigation/routes.dart';
import '../state/rates_controller.dart';
import '../state/settings_controller.dart';
import '../theme/app_colors.dart';
import '../utils/format.dart';
import '../widgets/currency_mark.dart';
import '../widgets/empty_state.dart';
import '../widgets/rate_row.dart';
import '../widgets/screen_header.dart';
import '../widgets/search_field.dart';

class _RateItem {
  const _RateItem({
    required this.currency,
    required this.rate,
    required this.favorite,
  });

  final CurrencyInfo currency;
  final double? rate;
  final bool favorite;
}

class RatesScreen extends StatefulWidget {
  const RatesScreen({super.key});

  @override
  State<RatesScreen> createState() => _RatesScreenState();
}

class _RatesScreenState extends State<RatesScreen> {
  String _query = '';

  @override
  Widget build(BuildContext context) {
    final rates = context.watch<RatesController>();
    final settings = context.watch<SettingsController>();
    final base = getCurrency(settings.displayBase);
    final items = _items(rates.rates, settings.displayBase, settings.favorites);
    final loading = rates.status == LoadStatus.loading;

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(
              AppSpacing.screen, 8, AppSpacing.screen, 0),
          child: Column(
            children: [
              ScreenHeader(
                kicker: 'Ринок',
                title: 'Курси',
                subtitle:
                    '1 ${base.code} · ${formatUpdatedAt(rates.updatedAt)}',
                action: _BaseButton(
                  code: base.code,
                  onPressed: () =>
                      openCurrencyPicker(context, CurrencyField.base),
                ),
              ),
              SearchField(
                hint: 'Пошук валюти',
                onChanged: (value) => setState(() => _query = value),
              ),
              const SizedBox(height: 8),
            ],
          ),
        ),
        Expanded(
          child: loading && items.isEmpty
              ? const Center(child: CircularProgressIndicator())
              : RefreshIndicator(
                  color: AppColors.mint,
                  onRefresh: () => context.read<RatesController>().load(),
                  child: ListView.builder(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.fromLTRB(
                        AppSpacing.screen, 0, AppSpacing.screen, 24),
                    itemCount: items.isEmpty ? 1 : items.length,
                    itemBuilder: (context, index) {
                      if (items.isEmpty) {
                        return EmptyState(
                          icon: rates.error != null
                              ? Icons.error_outline
                              : Icons.payments_outlined,
                          title: rates.error ?? 'Немає валют за цим запитом',
                          danger: rates.error != null,
                        );
                      }
                      final item = items[index];
                      return RateRow(
                        code: item.currency.code,
                        value: item.rate == null ? '—' : formatRate(item.rate),
                        favorite: item.favorite,
                        onPressed: () => openRateDetails(
                          context,
                          from: settings.displayBase,
                          to: item.currency.code,
                        ),
                        onToggleFavorite: () => context
                            .read<SettingsController>()
                            .toggleFavorite(item.currency.code),
                      );
                    },
                  ),
                ),
        ),
      ],
    );
  }

  List<_RateItem> _items(
    Map<String, double> rates,
    String displayBase,
    List<String> favorites,
  ) {
    final available = rates.keys;
    final known = listKnownCurrencies(available)
        .where((item) => item.code != displayBase);
    final needle = _query.trim().toLowerCase();
    final filtered = needle.isEmpty
        ? known
        : known.where(
            (item) =>
                item.code.toLowerCase().contains(needle) ||
                item.name.toLowerCase().contains(needle),
          );

    final items = filtered
        .map(
          (item) => _RateItem(
            currency: item,
            rate: crossRate(displayBase, item.code, rates),
            favorite: favorites.contains(item.code),
          ),
        )
        .toList();
    items.sort((left, right) {
      if (left.favorite != right.favorite) {
        return left.favorite ? -1 : 1;
      }
      return left.currency.code.compareTo(right.currency.code);
    });
    return items;
  }
}

class _BaseButton extends StatelessWidget {
  const _BaseButton({required this.code, required this.onPressed});

  final String code;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: 'Обрати базову валюту',
      child: Material(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        child: InkWell(
          onTap: onPressed,
          borderRadius: BorderRadius.circular(14),
          child: Container(
            constraints: const BoxConstraints(minWidth: 64),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: AppColors.line),
            ),
            child: Column(
              children: [
                CurrencyMark(code: code, size: 28),
                const SizedBox(height: 2),
                Text(
                  code,
                  style: const TextStyle(
                      color: AppColors.text, fontWeight: FontWeight.w700),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
