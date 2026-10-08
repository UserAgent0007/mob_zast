package ua.lab5.currency.ui.screens

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.unit.dp
import ua.lab5.currency.data.listKnownCurrencies
import ua.lab5.currency.ui.AppViewModel
import ua.lab5.currency.ui.components.AppTopBar
import ua.lab5.currency.ui.components.EmptyState
import ua.lab5.currency.ui.components.RateRow
import ua.lab5.currency.ui.components.SearchField

@Composable
fun CurrencyPickerScreen(
    viewModel: AppViewModel,
    field: String,
    onBack: () -> Unit,
) {
    val state by viewModel.state.collectAsState()
    var query by remember { mutableStateOf("") }
    val focusRequester = remember { FocusRequester() }
    val needle = query.trim().lowercase()
    val available = if (state.rates.isEmpty()) null else state.rates.keys
    val items = remember(available, state.favorites, needle) {
        listKnownCurrencies(available)
            .filter { currency ->
                needle.isEmpty() ||
                    currency.code.lowercase().contains(needle) ||
                    currency.name.lowercase().contains(needle)
            }
            .sortedWith(
                compareByDescending<ua.lab5.currency.data.Currency> { it.code in state.favorites }
                    .thenBy { it.code },
            )
    }

    LaunchedEffect(Unit) {
        focusRequester.requestFocus()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
    ) {
        AppTopBar(title = "Обрати валюту", onBack = onBack)
        Spacer(Modifier.height(8.dp))
        SearchField(
            value = query,
            onValueChange = { query = it },
            placeholder = "Код або назва валюти",
            focusRequester = focusRequester,
        )
        Spacer(Modifier.height(8.dp))
        LazyColumn(modifier = Modifier.fillMaxSize()) {
            if (items.isEmpty()) {
                item { EmptyState(title = "Валюту не знайдено") }
            } else {
                items(items, key = { it.code }) { currency ->
                    RateRow(
                        code = currency.code,
                        value = "",
                        favorite = currency.code in state.favorites,
                        onClick = {
                            when (field) {
                                "from" -> viewModel.setFrom(currency.code)
                                "to" -> viewModel.setTo(currency.code)
                                else -> viewModel.setDisplayBase(currency.code)
                            }
                            onBack()
                        },
                        onToggleFavorite = { viewModel.toggleFavorite(currency.code) },
                    )
                }
            }
        }
    }
}
