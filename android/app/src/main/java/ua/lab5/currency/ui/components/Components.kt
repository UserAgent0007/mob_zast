package ua.lab5.currency.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.outlined.StarBorder
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import ua.lab5.currency.data.HistoryItem
import ua.lab5.currency.data.currencyOf
import ua.lab5.currency.ui.theme.Bg
import ua.lab5.currency.ui.theme.Danger
import ua.lab5.currency.ui.theme.Dim
import ua.lab5.currency.ui.theme.Line
import ua.lab5.currency.ui.theme.Mint
import ua.lab5.currency.ui.theme.Muted
import ua.lab5.currency.ui.theme.SurfaceColor
import ua.lab5.currency.ui.theme.SurfaceRaised
import ua.lab5.currency.ui.theme.TextColor
import ua.lab5.currency.ui.theme.Warning

enum class ButtonVariant {
    Primary,
    Ghost,
    Danger,
}

@Composable
fun ScreenHeader(
    kicker: String,
    title: String,
    subtitle: String,
    subtitleColor: androidx.compose.ui.graphics.Color = Muted,
    action: @Composable (() -> Unit)? = null,
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = kicker.uppercase(),
                color = Mint,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp,
            )
            Text(
                text = title,
                color = TextColor,
                fontSize = 32.sp,
                fontWeight = FontWeight.Bold,
            )
            Text(
                text = subtitle,
                color = subtitleColor,
                fontSize = 14.sp,
            )
        }
        if (action != null) {
            Spacer(Modifier.width(12.dp))
            action()
        }
    }
}

@Composable
fun AppTopBar(title: String, onBack: () -> Unit) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        IconButton(onClick = onBack) {
            Icon(
                imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                contentDescription = "Назад",
                tint = TextColor,
            )
        }
        Text(
            text = title,
            color = TextColor,
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
        )
    }
}

@Composable
fun CurrencyMark(code: String, size: Dp = 40.dp) {
    val currency = currencyOf(code)
    Box(
        modifier = Modifier
            .size(size)
            .clip(CircleShape)
            .background(SurfaceRaised),
        contentAlignment = Alignment.Center,
    ) {
        Text(text = currency.flag, fontSize = (size.value * 0.42f).sp)
    }
}

@Composable
fun SearchField(
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String,
    modifier: Modifier = Modifier,
    focusRequester: FocusRequester? = null,
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .height(48.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(SurfaceColor)
            .border(1.dp, Line, RoundedCornerShape(16.dp))
            .padding(horizontal = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Icon(
            imageVector = Icons.Filled.Search,
            contentDescription = null,
            tint = Muted,
            modifier = Modifier.size(18.dp),
        )
        Spacer(Modifier.width(8.dp))
        BasicTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier
                .weight(1f)
                .then(if (focusRequester != null) Modifier.focusRequester(focusRequester) else Modifier),
            textStyle = TextStyle(color = TextColor, fontSize = 16.sp),
            singleLine = true,
            cursorBrush = SolidColor(Mint),
            decorationBox = { inner ->
                Box(contentAlignment = Alignment.CenterStart) {
                    if (value.isEmpty()) {
                        Text(text = placeholder, color = Dim, fontSize = 16.sp)
                    }
                    inner()
                }
            },
        )
    }
}

@Composable
fun PrimaryButton(
    label: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    variant: ButtonVariant = ButtonVariant.Primary,
) {
    val container = when (variant) {
        ButtonVariant.Primary -> Mint
        ButtonVariant.Ghost -> SurfaceRaised
        ButtonVariant.Danger -> Danger.copy(alpha = 0.18f)
    }
    val content = when (variant) {
        ButtonVariant.Primary -> Bg
        ButtonVariant.Ghost -> Mint
        ButtonVariant.Danger -> Danger
    }
    Button(
        onClick = onClick,
        enabled = enabled,
        modifier = modifier
            .fillMaxWidth()
            .height(48.dp),
        shape = RoundedCornerShape(12.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = container,
            contentColor = content,
            disabledContainerColor = SurfaceRaised,
            disabledContentColor = Dim,
        ),
    ) {
        Text(text = label, fontWeight = FontWeight.Bold)
    }
}

@Composable
fun EmptyState(
    title: String,
    body: String? = null,
    danger: Boolean = false,
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 48.dp, start = 24.dp, end = 24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(
            text = title,
            color = if (danger) Danger else TextColor,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center,
        )
        if (!body.isNullOrBlank()) {
            Spacer(Modifier.height(8.dp))
            Text(
                text = body,
                color = Muted,
                textAlign = TextAlign.Center,
            )
        }
    }
}

@Composable
fun CurrencyButton(code: String, label: String, onClick: () -> Unit) {
    val currency = currencyOf(code)
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(SurfaceColor)
            .border(1.dp, Line, RoundedCornerShape(16.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 12.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        CurrencyMark(code)
        Spacer(Modifier.width(10.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = label.uppercase(),
                color = Muted,
                fontSize = 11.sp,
                fontWeight = FontWeight.SemiBold,
                letterSpacing = 0.6.sp,
            )
            Text(
                text = currency.code,
                color = TextColor,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
            )
            Text(
                text = currency.name,
                color = Muted,
                fontSize = 12.sp,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
        }
        Icon(
            imageVector = Icons.Filled.KeyboardArrowDown,
            contentDescription = null,
            tint = Muted,
        )
    }
}

@Composable
fun RateRow(
    code: String,
    value: String,
    favorite: Boolean,
    onClick: () -> Unit,
    onToggleFavorite: () -> Unit,
) {
    val currency = currencyOf(code)
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        CurrencyMark(code, size = 36.dp)
        Spacer(Modifier.width(10.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(text = currency.code, color = TextColor, fontWeight = FontWeight.Bold, fontSize = 16.sp)
            Text(
                text = currency.name,
                color = Muted,
                fontSize = 12.sp,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
        }
        if (value.isNotEmpty()) {
            Text(
                text = value,
                color = Mint,
                fontWeight = FontWeight.Bold,
                fontSize = 15.sp,
            )
        }
        IconButton(onClick = onToggleFavorite) {
            Icon(
                imageVector = if (favorite) Icons.Filled.Star else Icons.Outlined.StarBorder,
                contentDescription = if (favorite) "Прибрати з обраного" else "Додати в обране",
                tint = if (favorite) Warning else Muted,
            )
        }
    }
}

@Composable
fun HistoryCard(
    item: HistoryItem,
    onClick: () -> Unit,
    onRemove: () -> Unit,
) {
    val from = currencyOf(item.from)
    val to = currencyOf(item.to)
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(SurfaceColor)
            .border(1.dp, Line, RoundedCornerShape(16.dp))
            .clickable(onClick = onClick),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(
            modifier = Modifier
                .width(4.dp)
                .height(88.dp)
                .background(Mint),
        )
        Column(
            modifier = Modifier
                .weight(1f)
                .padding(horizontal = 12.dp, vertical = 12.dp),
        ) {
            Text(text = item.createdAtLabel, color = Dim, fontSize = 12.sp)
            Text(
                text = "${from.code} → ${to.code}",
                color = TextColor,
                fontWeight = FontWeight.Bold,
                fontSize = 15.sp,
            )
            Text(
                text = "${item.amountLabel} ${from.symbol} = ${item.resultLabel} ${to.symbol}",
                color = Mint,
                fontWeight = FontWeight.SemiBold,
                fontSize = 14.sp,
            )
            Text(text = "Курс ${item.rateLabel}", color = Muted, fontSize = 12.sp)
        }
        IconButton(onClick = onRemove) {
            Icon(
                imageVector = Icons.Filled.Delete,
                contentDescription = "Видалити запис",
                tint = Muted,
            )
        }
    }
}

@Composable
fun InfoCard(
    modifier: Modifier = Modifier,
    onClick: (() -> Unit)? = null,
    container: androidx.compose.ui.graphics.Color = SurfaceColor,
    content: @Composable () -> Unit,
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(18.dp))
            .background(container)
            .border(1.dp, Line, RoundedCornerShape(18.dp))
            .then(if (onClick != null) Modifier.clickable(onClick = onClick) else Modifier)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
        content = { content() },
    )
}
