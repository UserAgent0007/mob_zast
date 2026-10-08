package ua.lab5.currency.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.SwapVert
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.runtime.collectAsState
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import ua.lab5.currency.data.LoadStatus
import ua.lab5.currency.data.POPULAR_CODES
import ua.lab5.currency.data.QUICK_AMOUNTS
import ua.lab5.currency.data.convertAmount
import ua.lab5.currency.data.crossRate
import ua.lab5.currency.data.currencyOf
import ua.lab5.currency.data.formatAmount
import ua.lab5.currency.data.formatRate
import ua.lab5.currency.data.formatUpdatedAt
import ua.lab5.currency.data.parseAmount
import ua.lab5.currency.ui.AppViewModel
import ua.lab5.currency.ui.components.CurrencyButton
import ua.lab5.currency.ui.components.PrimaryButton
import ua.lab5.currency.ui.components.ScreenHeader
import ua.lab5.currency.ui.theme.Bg
import ua.lab5.currency.ui.theme.Danger
import ua.lab5.currency.ui.theme.Dim
import ua.lab5.currency.ui.theme.Line
import ua.lab5.currency.ui.theme.Mint
import ua.lab5.currency.ui.theme.MintDeep
import ua.lab5.currency.ui.theme.Muted
import ua.lab5.currency.ui.theme.SurfaceColor
import ua.lab5.currency.ui.theme.TextColor

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun ConverterScreen(
    viewModel: AppViewModel,
    onPickCurrency: (String) -> Unit,
    onOpenHistory: () -> Unit,
) {
    val state by viewModel.state.collectAsState()
    val numericAmount = parseAmount(state.amount)
    val result = convertAmount(numericAmount, state.from, state.to, state.rates)
    val rate = crossRate(state.from, state.to, state.rates)
    val failed = state.status == LoadStatus.Error
    val subtitle = when {
        failed -> state.error ?: "Не вдалося завантажити курси."
        state.status == LoadStatus.Loading && state.updatedAt == null -> "Завантаження курсів…"
        else -> "Оновлено ${formatUpdatedAt(state.updatedAt)}"
    }
    val currency = currencyOf(state.from)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .imePadding()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
    ) {
        ScreenHeader(
            kicker = "Live rates",
            title = "Конвертер",
            subtitle = subtitle,
            subtitleColor = if (failed) Danger else Muted,
        )
        if (failed && state.rates.isEmpty()) {
            Spacer(Modifier.height(12.dp))
            PrimaryButton(label = "Спробувати ще раз", onClick = viewModel::loadRates)
        }

        Spacer(Modifier.height(16.dp))
        Surface(
            color = SurfaceColor,
            shape = RoundedCornerShape(20.dp),
            border = BorderStroke(1.dp, Line),
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(text = "Сума", color = Muted, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Text(
                        text = currency.symbol,
                        color = Mint,
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Bold,
                    )
                    BasicTextField(
                        value = state.amount,
                        onValueChange = viewModel::setAmount,
                        modifier = Modifier
                            .weight(1f)
                            .padding(start = 8.dp),
                        textStyle = TextStyle(
                            color = TextColor,
                            fontSize = 36.sp,
                            fontWeight = FontWeight.Light,
                        ),
                        singleLine = true,
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                        cursorBrush = SolidColor(Mint),
                        decorationBox = { inner ->
                            Box {
                                if (state.amount.isEmpty()) {
                                    Text(text = "0", color = Dim, fontSize = 36.sp, fontWeight = FontWeight.Light)
                                }
                                inner()
                            }
                        },
                    )
                }
            }
        }

        FlowRow(
            modifier = Modifier.padding(top = 12.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            QUICK_AMOUNTS.forEach { value ->
                val selected = state.amount == value.toString()
                Surface(
                    onClick = { viewModel.setAmount(value.toString()) },
                    color = if (selected) Mint else SurfaceColor,
                    shape = RoundedCornerShape(12.dp),
                    border = BorderStroke(1.dp, if (selected) Mint else Line),
                ) {
                    Text(
                        text = value.toString(),
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                        color = if (selected) Bg else TextColor,
                        fontWeight = FontWeight.SemiBold,
                    )
                }
            }
        }

        Spacer(Modifier.height(18.dp))
        CurrencyButton(code = state.from, label = "З валюти", onClick = { onPickCurrency("from") })
        IconButton(
            onClick = viewModel::swapCurrencies,
            modifier = Modifier.align(Alignment.CenterHorizontally),
        ) {
            Surface(shape = CircleShape, color = Mint) {
                Icon(
                    imageVector = Icons.Filled.SwapVert,
                    contentDescription = "Поміняти валюти місцями",
                    tint = Bg,
                    modifier = Modifier.padding(10.dp),
                )
            }
        }
        CurrencyButton(code = state.to, label = "У валюту", onClick = { onPickCurrency("to") })

        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 8.dp),
            color = MintDeep,
            shape = RoundedCornerShape(20.dp),
            border = BorderStroke(1.dp, Line),
        ) {
            Column(modifier = Modifier.padding(18.dp)) {
                Text(text = "Результат", color = Muted, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                Text(
                    text = if (result == null) "—" else formatAmount(result, state.decimals),
                    color = Mint,
                    fontSize = 40.sp,
                    fontWeight = FontWeight.Light,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
                Text(
                    text = "1 ${state.from} = ${formatRate(rate)} ${state.to}",
                    color = TextColor,
                    fontSize = 14.sp,
                )
            }
        }

        Spacer(Modifier.height(16.dp))
        PrimaryButton(
            label = "Зберегти в історію",
            onClick = {
                if (viewModel.saveConversion()) {
                    onOpenHistory()
                }
            },
            enabled = result != null && numericAmount > 0.0,
        )

        Text(
            text = "Популярні пари",
            color = TextColor,
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(top = 22.dp, bottom = 10.dp),
        )
        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            POPULAR_CODES.filter { it != state.from }.take(4).forEach { code ->
                Surface(
                    onClick = { viewModel.setPair(state.from, code) },
                    color = SurfaceColor,
                    shape = RoundedCornerShape(12.dp),
                    border = BorderStroke(1.dp, Line),
                ) {
                    Text(
                        text = "${state.from} → $code",
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                        color = TextColor,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold,
                    )
                }
            }
        }
        Spacer(Modifier.height(12.dp))
    }
}
