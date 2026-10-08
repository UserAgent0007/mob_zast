import 'package:flutter/material.dart';

import 'app_colors.dart';

ThemeData buildAppTheme() {
  const scheme = ColorScheme.dark(
    primary: AppColors.mint,
    onPrimary: AppColors.bg,
    secondary: AppColors.mint,
    onSecondary: AppColors.bg,
    surface: AppColors.surface,
    onSurface: AppColors.text,
    error: AppColors.danger,
    onError: AppColors.bg,
  );

  return ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    scaffoldBackgroundColor: AppColors.bg,
    colorScheme: scheme,
    canvasColor: AppColors.bg,
    dividerColor: AppColors.line,
    iconTheme: const IconThemeData(color: AppColors.text),
    splashColor: const Color(0x333EE0A2),
    highlightColor: const Color(0x143EE0A2),
    appBarTheme: const AppBarTheme(
      backgroundColor: AppColors.bg,
      foregroundColor: AppColors.text,
      elevation: 0,
      scrolledUnderElevation: 0,
      centerTitle: false,
      titleTextStyle: TextStyle(
        color: AppColors.text,
        fontSize: 18,
        fontWeight: FontWeight.w700,
      ),
    ),
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: AppColors.surface,
      indicatorColor: AppColors.mintDeep,
      height: 64,
      labelTextStyle: WidgetStateProperty.resolveWith((states) {
        final selected = states.contains(WidgetState.selected);
        return TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w600,
          color: selected ? AppColors.mint : AppColors.muted,
        );
      }),
      iconTheme: WidgetStateProperty.resolveWith((states) {
        final selected = states.contains(WidgetState.selected);
        return IconThemeData(
          color: selected ? AppColors.mint : AppColors.muted,
          size: 24,
        );
      }),
    ),
    textSelectionTheme: const TextSelectionThemeData(
      cursorColor: AppColors.mint,
      selectionHandleColor: AppColors.mint,
      selectionColor: Color(0x553EE0A2),
    ),
    progressIndicatorTheme: const ProgressIndicatorThemeData(
      color: AppColors.mint,
    ),
  );
}
