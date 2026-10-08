import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../state/converter_controller.dart';
import '../state/history_controller.dart';
import '../state/shell_controller.dart';
import '../theme/app_colors.dart';
import '../widgets/empty_state.dart';
import '../widgets/history_card.dart';
import '../widgets/primary_button.dart';
import '../widgets/screen_header.dart';

class HistoryScreen extends StatelessWidget {
  const HistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final items = context.watch<HistoryController>().items;

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(
              AppSpacing.screen, 8, AppSpacing.screen, 0),
          child: Column(
            children: [
              ScreenHeader(
                kicker: 'Архів',
                title: 'Історія',
                subtitle: items.isEmpty
                    ? 'Поки що порожньо'
                    : '${items.length} збережених конвертацій',
              ),
              if (items.isNotEmpty)
                PrimaryButton(
                  label: 'Очистити історію',
                  variant: ButtonVariant.danger,
                  onPressed: context.read<HistoryController>().clear,
                ),
            ],
          ),
        ),
        Expanded(
          child: items.isEmpty
              ? const EmptyState(
                  icon: Icons.history,
                  title: 'Історія ще порожня',
                  body: 'Зробіть конвертацію й натисніть «Зберегти в історію».',
                )
              : ListView.separated(
                  padding: const EdgeInsets.fromLTRB(
                      AppSpacing.screen, 12, AppSpacing.screen, 24),
                  itemCount: items.length,
                  separatorBuilder: (context, index) =>
                      const SizedBox(height: 10),
                  itemBuilder: (context, index) {
                    final item = items[index];
                    return HistoryCard(
                      item: item,
                      onPressed: () {
                        context.read<ConverterController>().setPair(
                              from: item.from,
                              to: item.to,
                              amount: item.amount,
                            );
                        context
                            .read<ShellController>()
                            .goTo(ShellController.converter);
                      },
                      onRemove: () =>
                          context.read<HistoryController>().remove(item.id),
                    );
                  },
                ),
        ),
      ],
    );
  }
}
