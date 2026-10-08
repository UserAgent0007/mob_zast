package ua.lab5.currency.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import ua.lab5.currency.data.convertAmount
import ua.lab5.currency.data.crossRate
import ua.lab5.currency.data.currencyOf
import ua.lab5.currency.data.formatAmount
import ua.lab5.currency.data.formatRate
import ua.lab5.currency.ui.AppViewModel
import ua.lab5.currency.ui.components.AppTopBar
import ua.lab5.currency.ui.components.ButtonVariant
import ua.lab5.currency.ui.components.InfoCard
import ua.lab5.currency.ui.components.PrimaryButton
import ua.lab5.currency.ui.theme.Line
import ua.lab5.currency.ui.theme.Mint
import ua.lab5.currency.ui.theme.MintDeep
import ua.lab5.currency.ui.theme.Muted
import ua.lab5.currency.ui.theme.TextColor

private val samples = listOf(1.0, 10.0, 100.0, 1000.0)

@Composable
fun RateDetailsScreen(
    viewModel: AppViewModel,
    from: String,
    to: String,
    onBack: () -> Unit,
    onOpenConverter: () -> Unit,
) {
    val state by viewModel.state.collectAsState()
    val fromCurrency = currencyOf(from)
    val toCurrency = currencyOf(to)
    val rate = crossRate(from, to, state.rates)
    val inverse = crossRate(to, from, state.rates)
    val favorite = to in state.favorites

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        AppTopBar(title = "Деталі курсу", onBack = onBack)

        InfoCard(container = MintDeep) {
            Column(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "${fromCurrency.code} → ${toCurrency.code}",
                    color = TextColor,
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp,
                )
                Text(
                    text = formatRate(rate),
                    color = Mint,
                    fontSize = 40.sp,
                    fontWeight = FontWeight.Light,
                )
                Text(
                    text = "1 ${fromCurrency.name} = ${formatRate(rate)} ${toCurrency.name}",
                    color = Muted,
                )
            }
        }

        InfoCard {
            Text(text = "Обернений курс", color = TextColor, fontWeight = FontWeight.Bold, fontSize = 16.sp)
            Text(
                text = "1 $to = ${formatRate(inverse)} $from",
                color = Mint,
                fontWeight = FontWeight.SemiBold,
                fontSize = 16.sp,
            )
        }

        InfoCard {
            Text(text = "Швидкі суми", color = TextColor, fontWeight = FontWeight.Bold, fontSize = 16.sp)
            samples.forEachIndexed { index, amount ->
                val converted = convertAmount(amount, from, to, state.rates)
                if (index > 0) {
                    HorizontalDivider(color = Line)
                }
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                ) {
                    Text(text = "${formatAmount(amount, 0)} $from", color = Muted)
                    Text(
                        text = "${if (converted == null) "—" else formatAmount(converted, state.decimals)} $to",
                        color = TextColor,
                        fontWeight = FontWeight.Bold,
                    )
                }
            }
        }

        PrimaryButton(
            label = "Відкрити в конвертері",
            onClick = {
                viewModel.setPair(from, to, "1")
                onOpenConverter()
            },
        )
        PrimaryButton(
            label = if (favorite) "Прибрати з обраного" else "Додати в обране",
            onClick = { viewModel.toggleFavorite(to) },
            variant = ButtonVariant.Ghost,
        )
        Spacer(Modifier.height(8.dp))
    }
}
