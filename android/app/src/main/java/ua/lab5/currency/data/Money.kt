package ua.lab5.currency.data

import java.text.NumberFormat
import java.text.ParseException
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

fun sanitizeAmount(raw: String): String {
    val cleaned = raw.replace(',', '.').filter { it.isDigit() || it == '.' }
    val firstDot = cleaned.indexOf('.')
    if (firstDot < 0) {
        return cleaned
    }
    val whole = cleaned.substring(0, firstDot)
    val fraction = cleaned.substring(firstDot + 1).replace(".", "").take(6)
    return "$whole.$fraction"
}

fun parseAmount(value: String): Double {
    val normalized = value.replace(',', '.').filter { it.isDigit() || it == '.' }
    if (normalized.isEmpty() || normalized == ".") {
        return 0.0
    }
    return normalized.toDoubleOrNull()?.takeIf { it.isFinite() } ?: 0.0
}

fun formatAmount(value: Double?, decimals: Int = 2): String {
    if (value == null || !value.isFinite()) {
        return "—"
    }
    return numberFormat(decimals, decimals).format(value)
}

fun formatRate(value: Double?): String {
    if (value == null || !value.isFinite()) {
        return "—"
    }
    val maxDecimals = if (value >= 1.0) 4 else 6
    return numberFormat(minimum = 2, maximum = maxDecimals).format(value)
}

fun crossRate(from: String, to: String, rates: Map<String, Double>): Double? {
    val fromRate = rates[from] ?: return null
    val toRate = rates[to] ?: return null
    if (fromRate == 0.0) {
        return null
    }
    return toRate / fromRate
}

fun convertAmount(amount: Double, from: String, to: String, rates: Map<String, Double>): Double? {
    val rate = crossRate(from, to, rates) ?: return null
    return amount * rate
}

fun formatUpdatedAt(raw: String?): String {
    if (raw.isNullOrBlank()) {
        return "ще не оновлено"
    }
    val date = parseServerDate(raw) ?: return raw
    return formatTimestamp(date)
}

fun formatTimestamp(date: Date = Date()): String {
    val format = SimpleDateFormat("dd MMM, HH:mm", Locale("uk", "UA"))
    return format.format(date)
}

private fun numberFormat(minimum: Int, maximum: Int): NumberFormat {
    return NumberFormat.getNumberInstance(Locale("uk", "UA")).apply {
        minimumFractionDigits = minimum
        maximumFractionDigits = maximum
        isGroupingUsed = true
    }
}

private val serverPatterns = listOf(
    "EEE, dd MMM yyyy HH:mm:ss Z",
    "yyyy-MM-dd'T'HH:mm:ssXXX",
    "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
    "yyyy-MM-dd'T'HH:mm:ss'Z'",
)

private fun parseServerDate(raw: String): Date? {
    for (pattern in serverPatterns) {
        try {
            val format = SimpleDateFormat(pattern, Locale.US)
            format.isLenient = false
            return format.parse(raw)
        } catch (_: ParseException) {
            continue
        }
    }
    return null
}
