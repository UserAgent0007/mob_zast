import 'package:flutter/material.dart';

import '../theme/app_colors.dart';

class AppCard extends StatelessWidget {
  const AppCard({
    super.key,
    required this.child,
    this.onTap,
    this.padding = const EdgeInsets.all(16),
    this.color = AppColors.surface,
    this.radius = 18,
  });

  final Widget child;
  final VoidCallback? onTap;
  final EdgeInsets padding;
  final Color color;
  final double radius;

  @override
  Widget build(BuildContext context) {
    final border = Border.all(color: AppColors.line);
    final radiusValue = BorderRadius.circular(radius);

    if (onTap == null) {
      return Container(
        width: double.infinity,
        padding: padding,
        decoration: BoxDecoration(
          color: color,
          borderRadius: radiusValue,
          border: border,
        ),
        child: child,
      );
    }

    return Material(
      color: color,
      borderRadius: radiusValue,
      child: InkWell(
        onTap: onTap,
        borderRadius: radiusValue,
        child: Container(
          width: double.infinity,
          padding: padding,
          decoration: BoxDecoration(
            borderRadius: radiusValue,
            border: border,
          ),
          child: child,
        ),
      ),
    );
  }
}
