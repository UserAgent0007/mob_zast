package ua.lab5.currency.ui.screens

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import ua.lab5.currency.data.LoadStatus
import ua.lab5.currency.data.crossRate
import ua.lab5.currency.data.currencyOf
import ua.lab5.currency.data.formatRate
import ua.lab5.currency.data.formatUpdatedAt
import ua.lab5.currency.data.listKnownCurrencies
import ua.lab5.currency.ui.AppViewModel
import ua.lab5.currency.ui.components.CurrencyMark
import ua.lab5.currency.ui.components.EmptyState
import ua.lab5.currency.ui.components.RateRow
import ua.lab5.currency.ui.components.ScreenHeader
import ua.lab5.currency.ui.components.SearchField
import ua.lab5.currency.ui.theme.Line
import ua.lab5.currency.ui.theme.Mint
import ua.lab5.currency.ui.theme.SurfaceColor
import ua.lab5.currency.ui.theme.TextColor
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.shape.RoundedCornerShape

private data class RateListItem(
    val code: String,
    val rate: Double?,
    val favorite: Boolean,
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RatesScreen(
    viewModel: AppViewModel,
    onPickBase: () -> Unit,
    onOpenDetails: (String, String) -> Unit,
) {
    val state by viewModel.state.collectAsState()
    var query by remember { mutableStateOf("") }
    val base = currencyOf(state.displayBase)
    val needle = query.trim().lowercase()
    val items = remember(state.rates, state.displayBase, state.favorites, needle) {
        listKnownCurrencies(state.rates.keys)
            .filter { it.code != state.displayBase }
            .filter { currency ->
                needle.isEmpty() ||
                    currency.code.lowercase().contains(needle) ||
                    currency.name.lowercase().contains(needle)
            }
            .map { currency ->
                RateListItem(
                    code = currency.code,
                    rate = crossRate(state.displayBase, currency.code, state.rates),
                    favorite = currency.code in state.favorites,
                )
            }
            .sortedWith(compareByDescending<RateListItem> { it.favorite }.thenBy { it.code })
    }
    val initialLoading = state.status == LoadStatus.Loading && state.rates.isEmpty()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
    ) {
        Spacer(Modifier.height(8.dp))
        ScreenHeader(
            kicker = "Ринок",
            title = "Курси",
            subtitle = "1 ${base.code} · ${formatUpdatedAt(state.updatedAt)}",
            action = {
                Surface(
                    onClick = onPickBase,
                    color = SurfaceColor,
                    shape = RoundedCornerShape(14.dp),
                    border = BorderStroke(1.dp, Line),
                ) {
                    Column(
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                    ) {
                        CurrencyMark(code = base.code, size = 28.dp)
                        Text(
                            text = base.code,
                            color = TextColor,
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp,
                        )
                    }
                }
            },
        )
        Spacer(Modifier.height(12.dp))
        SearchField(
            value = query,
            onValueChange = { query = it },
            placeholder = "Пошук валюти",
        )
        Spacer(Modifier.height(8.dp))

        if (initialLoading) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = Mint)
            }
        } else {
            PullToRefreshBox(
                isRefreshing = state.status == LoadStatus.Loading && state.rates.isNotEmpty(),
                onRefresh = viewModel::loadRates,
                modifier = Modifier.fillMaxSize(),
            ) {
                LazyColumn(modifier = Modifier.fillMaxSize()) {
                    if (items.isEmpty()) {
                        item {
                            EmptyState(
                                title = state.error ?: "Немає валют за цим запитом",
                                danger = state.error != null,
                            )
                        }
                    } else {
                        items(items, key = { it.code }) { item ->
                            RateRow(
                                code = item.code,
                                value = formatRate(item.rate),
                                favorite = item.favorite,
                                onClick = { onOpenDetails(state.displayBase, item.code) },
                                onToggleFavorite = { viewModel.toggleFavorite(item.code) },
                            )
                        }
                    }
                }
            }
        }
    }
}
