package ua.lab5.currency.ui.screens

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import ua.lab5.currency.ui.AppViewModel
import ua.lab5.currency.ui.components.ButtonVariant
import ua.lab5.currency.ui.components.EmptyState
import ua.lab5.currency.ui.components.HistoryCard
import ua.lab5.currency.ui.components.PrimaryButton
import ua.lab5.currency.ui.components.ScreenHeader

@Composable
fun HistoryScreen(
    viewModel: AppViewModel,
    onRestore: () -> Unit,
) {
    val state by viewModel.state.collectAsState()
    val items = state.history

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
    ) {
        Spacer(Modifier.height(8.dp))
        ScreenHeader(
            kicker = "Архів",
            title = "Історія",
            subtitle = if (items.isEmpty()) {
                "Поки що порожньо"
            } else {
                "${items.size} збережених конвертацій"
            },
        )
        if (items.isNotEmpty()) {
            Spacer(Modifier.height(12.dp))
            PrimaryButton(
                label = "Очистити історію",
                onClick = viewModel::clearHistory,
                variant = ButtonVariant.Danger,
            )
        }
        Spacer(Modifier.height(12.dp))
        LazyColumn(modifier = Modifier.fillMaxSize()) {
            if (items.isEmpty()) {
                item {
                    EmptyState(
                        title = "Історія ще порожня",
                        body = "Зробіть конвертацію й натисніть «Зберегти в історію».",
                    )
                }
            } else {
                items(items, key = { it.id }) { item ->
                    HistoryCard(
                        item = item,
                        onClick = {
                            viewModel.setPair(item.from, item.to, item.amountText)
                            onRestore()
                        },
                        onRemove = { viewModel.removeHistory(item.id) },
                    )
                    Spacer(Modifier.height(10.dp))
                }
            }
        }
    }
}
