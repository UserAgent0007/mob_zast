package ua.lab5.currency.data

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject

class PreferencesStore(context: Context) {
    private val prefs = context.applicationContext.getSharedPreferences(FILE, Context.MODE_PRIVATE)

    fun read(): StoredState {
        val favorites = prefs.getString(KEY_FAVORITES, null)
            ?.split(',')
            ?.map { it.trim() }
            ?.filter { it.isNotEmpty() }
            ?.distinct()
            .orEmpty()
            .ifEmpty { DEFAULT_FAVORITES }
        val decimals = prefs.getInt(KEY_DECIMALS, 2).takeIf { it in DECIMAL_OPTIONS } ?: 2

        return StoredState(
            from = prefs.getString(KEY_FROM, "UAH") ?: "UAH",
            to = prefs.getString(KEY_TO, "USD") ?: "USD",
            amount = prefs.getString(KEY_AMOUNT, "1000") ?: "1000",
            decimals = decimals,
            displayBase = prefs.getString(KEY_BASE, "UAH") ?: "UAH",
            favorites = favorites,
            history = readHistory(),
        )
    }

    fun saveSettings(decimals: Int, displayBase: String, favorites: List<String>) {
        prefs.edit()
            .putInt(KEY_DECIMALS, decimals)
            .putString(KEY_BASE, displayBase)
            .putString(KEY_FAVORITES, favorites.joinToString(","))
            .apply()
    }

    fun saveConverter(from: String, to: String, amount: String) {
        prefs.edit()
            .putString(KEY_FROM, from)
            .putString(KEY_TO, to)
            .putString(KEY_AMOUNT, amount)
            .apply()
    }

    fun saveHistory(items: List<HistoryItem>) {
        val array = JSONArray()
        items.forEach { item ->
            array.put(
                JSONObject()
                    .put("id", item.id)
                    .put("from", item.from)
                    .put("to", item.to)
                    .put("amountText", item.amountText)
                    .put("amountLabel", item.amountLabel)
                    .put("resultLabel", item.resultLabel)
                    .put("rateLabel", item.rateLabel)
                    .put("createdAtLabel", item.createdAtLabel),
            )
        }
        prefs.edit().putString(KEY_HISTORY, array.toString()).apply()
    }

    private fun readHistory(): List<HistoryItem> {
        val raw = prefs.getString(KEY_HISTORY, null) ?: return emptyList()
        return try {
            val array = JSONArray(raw)
            buildList {
                for (index in 0 until array.length()) {
                    val item = array.getJSONObject(index)
                    add(
                        HistoryItem(
                            id = item.getString("id"),
                            from = item.getString("from"),
                            to = item.getString("to"),
                            amountText = item.getString("amountText"),
                            amountLabel = item.getString("amountLabel"),
                            resultLabel = item.getString("resultLabel"),
                            rateLabel = item.getString("rateLabel"),
                            createdAtLabel = item.getString("createdAtLabel"),
                        ),
                    )
                }
            }
        } catch (_: Exception) {
            emptyList()
        }
    }

    private companion object {
        const val FILE = "currency_prefs"
        const val KEY_DECIMALS = "decimals"
        const val KEY_BASE = "display_base"
        const val KEY_FAVORITES = "favorites"
        const val KEY_FROM = "from"
        const val KEY_TO = "to"
        const val KEY_AMOUNT = "amount"
        const val KEY_HISTORY = "history"
    }
}

data class StoredState(
    val from: String,
    val to: String,
    val amount: String,
    val decimals: Int,
    val displayBase: String,
    val favorites: List<String>,
    val history: List<HistoryItem>,
)
