import 'package:flutter/material.dart';

import '../data/currencies.dart';
import '../theme/app_colors.dart';
import 'currency_mark.dart';

class RateRow extends StatelessWidget {
  const RateRow({
    super.key,
    required this.code,
    required this.value,
    required this.favorite,
    required this.onPressed,
    required this.onToggleFavorite,
  });

  final String code;
  final String value;
  final bool favorite;
  final VoidCallback onPressed;
  final VoidCallback onToggleFavorite;

  @override
  Widget build(BuildContext context) {
    final currency = getCurrency(code);
    return DecoratedBox(
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: AppColors.line)),
      ),
      child: InkWell(
        onTap: onPressed,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
          child: Row(
            children: [
              CurrencyMark(code: code, size: 36),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      currency.code,
                      style: const TextStyle(
                        color: AppColors.text,
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      currency.name,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style:
                          const TextStyle(color: AppColors.muted, fontSize: 12),
                    ),
                  ],
                ),
              ),
              Text(
                value,
                style: const TextStyle(
                  color: AppColors.mint,
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  fontFeatures: [FontFeature.tabularFigures()],
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                onPressed: onToggleFavorite,
                tooltip: favorite ? 'Прибрати з обраного' : 'Додати в обране',
                icon: Icon(
                  favorite ? Icons.star : Icons.star_border,
                  size: 18,
                  color: favorite ? AppColors.warning : AppColors.muted,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
