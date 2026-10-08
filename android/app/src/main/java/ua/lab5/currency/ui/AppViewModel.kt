package ua.lab5.currency.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import ua.lab5.currency.data.CurrencyUiState
import ua.lab5.currency.data.DECIMAL_OPTIONS
import ua.lab5.currency.data.HistoryItem
import ua.lab5.currency.data.LoadStatus
import ua.lab5.currency.data.PreferencesStore
import ua.lab5.currency.data.RatesApi
import ua.lab5.currency.data.convertAmount
import ua.lab5.currency.data.crossRate
import ua.lab5.currency.data.formatAmount
import ua.lab5.currency.data.formatRate
import ua.lab5.currency.data.formatTimestamp
import ua.lab5.currency.data.parseAmount
import ua.lab5.currency.data.sanitizeAmount

class AppViewModel(application: Application) : AndroidViewModel(application) {
    private val store = PreferencesStore(application)
    private val _state = MutableStateFlow(CurrencyUiState())
    val state: StateFlow<CurrencyUiState> = _state.asStateFlow()
    private var requestId = 0

    init {
        val saved = store.read()
        _state.value = CurrencyUiState(
            from = saved.from,
            to = saved.to,
            amount = saved.amount,
            decimals = saved.decimals,
            displayBase = saved.displayBase,
            favorites = saved.favorites,
            history = saved.history,
        )
        loadRates()
    }

    fun loadRates() {
        val ticket = ++requestId
        viewModelScope.launch {
            _state.update { it.copy(status = LoadStatus.Loading, error = null) }
            val result = withContext(Dispatchers.IO) {
                runCatching { RatesApi.fetch() }
            }
            if (ticket != requestId) {
                return@launch
            }
            result.fold(
                onSuccess = { snapshot ->
                    _state.update {
                        it.copy(
                            status = LoadStatus.Success,
                            rates = snapshot.rates,
                            updatedAt = snapshot.updatedAt,
                            provider = snapshot.provider,
                            error = null,
                        )
                    }
                },
                onFailure = { error ->
                    _state.update {
                        it.copy(
                            status = LoadStatus.Error,
                            error = error.message ?: "Невідома помилка завантаження курсів.",
                        )
                    }
                },
            )
        }
    }

    fun setAmount(raw: String) {
        _state.update { it.copy(amount = sanitizeAmount(raw)) }
        persistConverter()
    }

    fun setFrom(code: String) {
        _state.update { state ->
            if (code == state.to) {
                state.copy(from = code, to = state.from)
            } else {
                state.copy(from = code)
            }
        }
        persistConverter()
    }

    fun setTo(code: String) {
        _state.update { state ->
            if (code == state.from) {
                state.copy(to = code, from = state.to)
            } else {
                state.copy(to = code)
            }
        }
        persistConverter()
    }

    fun setPair(from: String, to: String, amount: String? = null) {
        _state.update { state ->
            state.copy(
                from = from,
                to = to,
                amount = amount?.let(::sanitizeAmount) ?: state.amount,
            )
        }
        persistConverter()
    }

    fun swapCurrencies() {
        _state.update { it.copy(from = it.to, to = it.from) }
        persistConverter()
    }

    fun setDecimals(value: Int) {
        if (value !in DECIMAL_OPTIONS) {
            return
        }
        _state.update { it.copy(decimals = value) }
        persistSettings()
    }

    fun setDisplayBase(code: String) {
        _state.update { it.copy(displayBase = code) }
        persistSettings()
    }

    fun toggleFavorite(code: String) {
        _state.update { state ->
            val next = if (code in state.favorites) {
                if (state.favorites.size <= 1) state.favorites else state.favorites.filter { it != code }
            } else {
                state.favorites + code
            }
            state.copy(favorites = next)
        }
        persistSettings()
    }

    fun saveConversion(): Boolean {
        val current = _state.value
        val numeric = parseAmount(current.amount)
        if (numeric <= 0.0) {
            return false
        }
        val result = convertAmount(numeric, current.from, current.to, current.rates) ?: return false
        val rate = crossRate(current.from, current.to, current.rates) ?: return false
        val item = HistoryItem(
            id = "${System.currentTimeMillis()}-${current.history.size}",
            from = current.from,
            to = current.to,
            amountText = current.amount,
            amountLabel = formatAmount(numeric, current.decimals),
            resultLabel = formatAmount(result, current.decimals),
            rateLabel = formatRate(rate),
            createdAtLabel = formatTimestamp(),
        )
        val history = listOf(item) + current.history.take(39)
        _state.update { it.copy(history = history) }
        store.saveHistory(history)
        return true
    }

    fun removeHistory(id: String) {
        val history = _state.value.history.filter { it.id != id }
        _state.update { it.copy(history = history) }
        store.saveHistory(history)
    }

    fun clearHistory() {
        _state.update { it.copy(history = emptyList()) }
        store.saveHistory(emptyList())
    }

    private fun persistSettings() {
        val current = _state.value
        store.saveSettings(current.decimals, current.displayBase, current.favorites)
    }

    private fun persistConverter() {
        val current = _state.value
        store.saveConverter(current.from, current.to, current.amount)
    }
}
