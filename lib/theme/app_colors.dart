import 'package:flutter/material.dart';

abstract final class AppColors {
  static const bg = Color(0xFF08110F);
  static const surface = Color(0xFF12201C);
  static const surfaceRaised = Color(0xFF1A2C26);
  static const mint = Color(0xFF3EE0A2);
  static const mintDeep = Color(0xFF0C3B2C);
  static const text = Color(0xFFF3FBF7);
  static const muted = Color(0xFF8AA399);
  static const dim = Color(0xFF5E7268);
  static const line = Color(0x14F3FBF7);
  static const danger = Color(0xFFE07A6A);
  static const warning = Color(0xFFE4B15A);
}

abstract final class AppSpacing {
  static const screen = 16.0;
}

abstract final class AppText {
  static const kicker = TextStyle(
    color: AppColors.mint,
    fontSize: 12,
    fontWeight: FontWeight.w700,
    letterSpacing: 1.4,
  );

  static const title = TextStyle(
    color: AppColors.text,
    fontSize: 28,
    fontWeight: FontWeight.w700,
  );

  static const subtitle = TextStyle(
    color: AppColors.muted,
    fontSize: 14,
    height: 1.4,
  );

  static const cardTitle = TextStyle(
    color: AppColors.text,
    fontSize: 16,
    fontWeight: FontWeight.w700,
  );

  static const hint = TextStyle(
    color: AppColors.muted,
    fontSize: 13,
    height: 1.4,
  );
}
