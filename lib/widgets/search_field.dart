import 'package:flutter/material.dart';

import '../theme/app_colors.dart';

class SearchField extends StatelessWidget {
  const SearchField({
    super.key,
    required this.onChanged,
    required this.hint,
    this.autofocus = false,
    this.capitalization = TextCapitalization.none,
  });

  final ValueChanged<String> onChanged;
  final String hint;
  final bool autofocus;
  final TextCapitalization capitalization;

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: const BoxConstraints(minHeight: 48),
      padding: const EdgeInsets.symmetric(horizontal: 12),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.line),
      ),
      child: Row(
        children: [
          const Icon(Icons.search, size: 18, color: AppColors.muted),
          const SizedBox(width: 8),
          Expanded(
            child: TextField(
              onChanged: onChanged,
              autofocus: autofocus,
              autocorrect: false,
              textCapitalization: capitalization,
              style: const TextStyle(color: AppColors.text, fontSize: 16),
              cursorColor: AppColors.mint,
              decoration: InputDecoration(
                isCollapsed: true,
                border: InputBorder.none,
                hintText: hint,
                hintStyle: const TextStyle(color: AppColors.dim, fontSize: 16),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
