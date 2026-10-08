package ua.lab5.currency.data

import org.json.JSONException
import org.json.JSONObject
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder

object RatesApi {
    private const val ENDPOINT = "https://open.er-api.com/v6/latest"

    fun fetch(base: String = "USD"): RatesSnapshot {
        val encoded = URLEncoder.encode(base, Charsets.UTF_8.name())
        val connection = (URL("$ENDPOINT/$encoded").openConnection() as HttpURLConnection).apply {
            requestMethod = "GET"
            connectTimeout = 12_000
            readTimeout = 12_000
            setRequestProperty("Accept", "application/json")
            setRequestProperty("User-Agent", "CurrencyConverter/1.0 (Android)")
        }

        try {
            val code = connection.responseCode
            if (code !in 200..299) {
                throw IllegalStateException("Сервіс курсів тимчасово недоступний.")
            }
            val body = connection.inputStream.bufferedReader(Charsets.UTF_8).use { it.readText() }
            return parse(body, base)
        } catch (error: IllegalStateException) {
            throw error
        } catch (_: IOException) {
            throw IllegalStateException("Немає з'єднання з сервісом курсів. Перевірте мережу.")
        } catch (_: JSONException) {
            throw IllegalStateException("Не вдалося прочитати відповідь сервісу курсів.")
        } finally {
            connection.disconnect()
        }
    }

    private fun parse(body: String, requestedBase: String): RatesSnapshot {
        val json = JSONObject(body)
        if (json.optString("result") != "success" || !json.has("rates")) {
            throw IllegalStateException("Не вдалося прочитати відповідь сервісу курсів.")
        }
        val ratesJson = json.getJSONObject("rates")
        val rates = buildMap {
            val keys = ratesJson.keys()
            while (keys.hasNext()) {
                val key = keys.next()
                put(key, ratesJson.getDouble(key))
            }
        }
        return RatesSnapshot(
            base = json.optString("base_code", requestedBase),
            rates = rates,
            updatedAt = json.optString("time_last_update_utc"),
            provider = "ExchangeRate-API",
        )
    }
}
