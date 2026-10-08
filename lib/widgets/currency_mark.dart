import 'package:flutter/material.dart';

import '../data/currencies.dart';
import '../theme/app_colors.dart';

class CurrencyMark extends StatelessWidget {
  const CurrencyMark({super.key, required this.code, this.size = 40});

  final String code;
  final double size;

  @override
  Widget build(BuildContext context) {
    final currency = getCurrency(code);
    final fontSize = currency.symbol.length > 2 ? size * 0.28 : size * 0.4;

    return Container(
      width: size,
      height: size,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: AppColors.mintDeep,
        shape: BoxShape.circle,
        border: Border.all(color: AppColors.line),
      ),
      child: Text(
        currency.symbol,
        maxLines: 1,
        style: TextStyle(
          color: AppColors.mint,
          fontWeight: FontWeight.w700,
          fontSize: fontSize,
        ),
      ),
    );
  }
}
