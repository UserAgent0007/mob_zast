package ua.lab5.currency.data

data class Currency(
    val code: String,
    val name: String,
    val flag: String,
    val symbol: String,
)

data class HistoryItem(
    val id: String,
    val from: String,
    val to: String,
    val amountText: String,
    val amountLabel: String,
    val resultLabel: String,
    val rateLabel: String,
    val createdAtLabel: String,
)

data class RatesSnapshot(
    val base: String,
    val rates: Map<String, Double>,
    val updatedAt: String,
    val provider: String,
)

enum class LoadStatus {
    Idle,
    Loading,
    Success,
    Error,
}

data class CurrencyUiState(
    val rates: Map<String, Double> = emptyMap(),
    val updatedAt: String? = null,
    val provider: String = "ExchangeRate-API",
    val status: LoadStatus = LoadStatus.Idle,
    val error: String? = null,
    val from: String = "UAH",
    val to: String = "USD",
    val amount: String = "1000",
    val decimals: Int = 2,
    val displayBase: String = "UAH",
    val favorites: List<String> = DEFAULT_FAVORITES,
    val history: List<HistoryItem> = emptyList(),
)
