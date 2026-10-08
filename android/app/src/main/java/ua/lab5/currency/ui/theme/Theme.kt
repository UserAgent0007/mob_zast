package ua.lab5.currency.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val Bg = Color(0xFF08110F)
val SurfaceColor = Color(0xFF12201C)
val SurfaceRaised = Color(0xFF1A2C26)
val Mint = Color(0xFF3EE0A2)
val MintDeep = Color(0xFF0C3B2C)
val TextColor = Color(0xFFF3FBF7)
val Muted = Color(0xFF8AA399)
val Dim = Color(0xFF5E7268)
val Line = Color(0x14F3FBF7)
val Danger = Color(0xFFE07A6A)
val Warning = Color(0xFFE4B15A)

private val scheme = darkColorScheme(
    primary = Mint,
    onPrimary = Bg,
    secondary = Mint,
    background = Bg,
    onBackground = TextColor,
    surface = SurfaceColor,
    onSurface = TextColor,
    error = Danger,
)

@Composable
fun CurrencyTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = scheme,
        content = content,
    )
}
