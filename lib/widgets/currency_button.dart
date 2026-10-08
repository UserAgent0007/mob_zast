import 'package:flutter/material.dart';

import '../data/currencies.dart';
import '../theme/app_colors.dart';
import 'currency_mark.dart';

class CurrencyButton extends StatelessWidget {
  const CurrencyButton({
    super.key,
    required this.code,
    required this.label,
    required this.onPressed,
  });

  final String code;
  final String label;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    final currency = getCurrency(code);
    return Semantics(
      button: true,
      label: '$label: ${currency.name}',
      child: Material(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        child: InkWell(
          onTap: onPressed,
          borderRadius: BorderRadius.circular(16),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.line),
            ),
            child: Row(
              children: [
                CurrencyMark(code: code),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        label.toUpperCase(),
                        style: const TextStyle(
                          color: AppColors.muted,
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          letterSpacing: 0.6,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        currency.code,
                        style: const TextStyle(
                          color: AppColors.text,
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      Text(
                        currency.name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                            color: AppColors.muted, fontSize: 12),
                      ),
                    ],
                  ),
                ),
                const Icon(Icons.expand_more, color: AppColors.muted, size: 18),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
