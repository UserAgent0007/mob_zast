package ua.lab5.currency.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import ua.lab5.currency.data.DECIMAL_OPTIONS
import ua.lab5.currency.data.LoadStatus
import ua.lab5.currency.data.currencyOf
import ua.lab5.currency.data.formatUpdatedAt
import ua.lab5.currency.ui.AppViewModel
import ua.lab5.currency.ui.components.InfoCard
import ua.lab5.currency.ui.components.PrimaryButton
import ua.lab5.currency.ui.components.ScreenHeader
import ua.lab5.currency.ui.theme.Bg
import ua.lab5.currency.ui.theme.Mint
import ua.lab5.currency.ui.theme.MintDeep
import ua.lab5.currency.ui.theme.Muted
import ua.lab5.currency.ui.theme.SurfaceRaised
import ua.lab5.currency.ui.theme.TextColor

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun SettingsScreen(
    viewModel: AppViewModel,
    onPickBase: () -> Unit,
) {
    val state by viewModel.state.collectAsState()
    val base = currencyOf(state.displayBase)
    val loading = state.status == LoadStatus.Loading

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        ScreenHeader(
            kicker = "Профіль",
            title = "Налаштування",
            subtitle = "Точність, базова валюта та обране",
        )

        InfoCard {
            Text(text = "Знаків після коми", color = TextColor, fontWeight = FontWeight.Bold, fontSize = 16.sp)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                for (value in DECIMAL_OPTIONS) {
                    val active = state.decimals == value
                    Surface(
                        onClick = { viewModel.setDecimals(value) },
                        modifier = Modifier.weight(1f),
                        color = if (active) Mint else SurfaceRaised,
                        shape = RoundedCornerShape(12.dp),
                    ) {
                        Text(
                            text = value.toString(),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 12.dp),
                            color = if (active) Bg else TextColor,
                            fontWeight = FontWeight.Bold,
                            textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                        )
                    }
                }
            }
        }

        InfoCard(onClick = onPickBase) {
            Text(text = "База для таблиці курсів", color = TextColor, fontWeight = FontWeight.Bold, fontSize = 16.sp)
            Text(
                text = "${base.code} · ${base.name}",
                color = Mint,
                fontWeight = FontWeight.SemiBold,
                fontSize = 15.sp,
            )
        }

        InfoCard {
            Text(text = "Обрані валюти", color = TextColor, fontWeight = FontWeight.Bold, fontSize = 16.sp)
            FlowRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                state.favorites.forEach { code ->
                    Surface(
                        onClick = { viewModel.toggleFavorite(code) },
                        color = MintDeep,
                        shape = RoundedCornerShape(999.dp),
                    ) {
                        Text(
                            text = currencyOf(code).code,
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                            color = TextColor,
                            fontWeight = FontWeight.SemiBold,
                        )
                    }
                }
            }
            Text(
                text = "Натисніть валюту, щоб прибрати її з обраного.",
                color = Muted,
                fontSize = 13.sp,
            )
        }

        InfoCard {
            Text(text = "Джерело даних", color = TextColor, fontWeight = FontWeight.Bold, fontSize = 16.sp)
            Text(text = state.provider, color = Mint, fontWeight = FontWeight.SemiBold)
            Text(
                text = "Мережевий виклик: open.er-api.com. Останнє оновлення ${formatUpdatedAt(state.updatedAt)}.",
                color = Muted,
                fontSize = 13.sp,
            )
            if (!state.error.isNullOrBlank() && state.status == LoadStatus.Error) {
                Text(text = state.error.orEmpty(), color = ua.lab5.currency.ui.theme.Danger, fontSize = 13.sp)
            }
            PrimaryButton(
                label = if (loading) "Оновлення…" else "Оновити курси зараз",
                onClick = viewModel::loadRates,
                enabled = !loading,
                variant = ua.lab5.currency.ui.components.ButtonVariant.Ghost,
            )
        }

        InfoCard {
            Text(text = "Архітектура", color = TextColor, fontWeight = FontWeight.Bold, fontSize = 16.sp)
            Text(
                text = "Стан тримає ViewModel: курси, конвертер, історію та налаштування. " +
                    "Нижня навігація веде між розділами, а стек відкриває вибір валюти та деталі пари. " +
                    "Налаштування й історія зберігаються на пристрої.",
                color = Muted,
                fontSize = 13.sp,
            )
        }
        Spacer(Modifier.height(12.dp))
    }
}
