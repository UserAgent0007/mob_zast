import 'package:flutter/material.dart';

import '../data/currencies.dart';
import '../models/history_entry.dart';
import '../theme/app_colors.dart';

class HistoryCard extends StatelessWidget {
  const HistoryCard({
    super.key,
    required this.item,
    required this.onPressed,
    required this.onRemove,
  });

  final HistoryEntry item;
  final VoidCallback onPressed;
  final VoidCallback onRemove;

  @override
  Widget build(BuildContext context) {
    final from = getCurrency(item.from);
    final to = getCurrency(item.to);

    return Material(
      color: AppColors.surface,
      borderRadius: BorderRadius.circular(16),
      clipBehavior: Clip.antiAlias,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.line),
        ),
        child: IntrinsicHeight(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const ColoredBox(
                  color: AppColors.mint, child: SizedBox(width: 4)),
              Expanded(
                child: InkWell(
                  onTap: onPressed,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 12, vertical: 12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          item.createdAtLabel,
                          style: const TextStyle(
                              color: AppColors.dim, fontSize: 12),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${from.code} → ${to.code}',
                          style: const TextStyle(
                            color: AppColors.text,
                            fontSize: 15,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${item.amountLabel} ${from.symbol} = ${item.resultLabel} ${to.symbol}',
                          style: const TextStyle(
                            color: AppColors.mint,
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Курс ${item.rateLabel}',
                          style: const TextStyle(
                              color: AppColors.muted, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              IconButton(
                onPressed: onRemove,
                tooltip: 'Видалити запис',
                icon: const Icon(Icons.delete_outline,
                    size: 18, color: AppColors.muted),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
