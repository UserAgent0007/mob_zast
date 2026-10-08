import 'package:flutter/material.dart';

import '../data/currencies.dart';
import '../theme/app_colors.dart';

class QuickAmountRow extends StatelessWidget {
  const QuickAmountRow({super.key, required this.onSelect});

  final ValueChanged<String> onSelect;

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        for (final value in quickAmounts)
          Semantics(
            button: true,
            label: 'Сума $value',
            child: Material(
              color: AppColors.surfaceRaised,
              borderRadius: BorderRadius.circular(999),
              child: InkWell(
                onTap: () => onSelect('$value'),
                borderRadius: BorderRadius.circular(999),
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(999),
                    border: Border.all(color: AppColors.line),
                  ),
                  child: Text(
                    '$value',
                    style: const TextStyle(
                      color: AppColors.mint,
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }
}
