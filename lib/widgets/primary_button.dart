import 'package:flutter/material.dart';

import '../theme/app_colors.dart';

enum ButtonVariant { primary, ghost, danger, accent }

class PrimaryButton extends StatelessWidget {
  const PrimaryButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.variant = ButtonVariant.primary,
    this.enabled = true,
  });

  final String label;
  final VoidCallback onPressed;
  final ButtonVariant variant;
  final bool enabled;

  @override
  Widget build(BuildContext context) {
    final Color background;
    final Color foreground;
    final Border? border;

    switch (variant) {
      case ButtonVariant.primary:
        background = AppColors.mint;
        foreground = AppColors.bg;
        border = null;
      case ButtonVariant.ghost:
        background = AppColors.surfaceRaised;
        foreground = AppColors.text;
        border = Border.all(color: AppColors.line);
      case ButtonVariant.danger:
        background = Colors.transparent;
        foreground = AppColors.danger;
        border = Border.all(color: AppColors.danger);
      case ButtonVariant.accent:
        background = AppColors.surfaceRaised;
        foreground = AppColors.mint;
        border = null;
    }

    return Semantics(
      button: true,
      label: label,
      child: SizedBox(
        width: double.infinity,
        child: Material(
          color: background,
          borderRadius: BorderRadius.circular(14),
          child: InkWell(
            onTap: enabled ? onPressed : null,
            borderRadius: BorderRadius.circular(14),
            child: Opacity(
              opacity: enabled ? 1 : 0.4,
              child: Container(
                constraints: const BoxConstraints(minHeight: 48),
                alignment: Alignment.center,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(14),
                  border: border,
                ),
                child: Text(
                  label,
                  style: TextStyle(
                    color: foreground,
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
