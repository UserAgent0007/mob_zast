using System.Net.Http.Json;
using System.Text.Json.Serialization;
using CurrencyConverter.Core.Models;

namespace CurrencyConverter.Core.Services;

public sealed class RatesClient : IRatesClient
{
    public const string Endpoint = "https://open.er-api.com/v6/latest";

    private readonly HttpClient _http;

    public RatesClient(HttpClient http)
    {
        _http = http;
    }

    public async Task<RatesSnapshot> FetchLatestAsync(string baseCode = "USD", CancellationToken cancellationToken = default)
    {
        var url = $"{Endpoint}/{Uri.EscapeDataString(baseCode)}";
        HttpResponseMessage response;
        try
        {
            response = await _http.GetAsync(url, cancellationToken);
        }
        catch (Exception exception) when (exception is HttpRequestException or TaskCanceledException)
        {
            throw new RatesException("Немає з’єднання з сервісом курсів. Перевірте мережу.");
        }

        using (response)
        {
            if (!response.IsSuccessStatusCode)
            {
                throw new RatesException("Сервіс курсів тимчасово недоступний.");
            }

            ErApiResponse? data;
            try
            {
                data = await response.Content.ReadFromJsonAsync<ErApiResponse>(cancellationToken);
            }
            catch (Exception exception) when (exception is not OperationCanceledException)
            {
                throw new RatesException("Не вдалося прочитати відповідь сервісу курсів.");
            }

            if (data?.Result != "success" || data.Rates is null || data.Rates.Count == 0)
            {
                throw new RatesException("Не вдалося прочитати відповідь сервісу курсів.");
            }

            return new RatesSnapshot(
                data.BaseCode ?? baseCode,
                data.Rates,
                data.TimeLastUpdateUtc ?? DateTimeOffset.UtcNow.ToString("O"),
                "ExchangeRate-API");
        }
    }

    private sealed class ErApiResponse
    {
        [JsonPropertyName("result")]
        public string? Result { get; set; }

        [JsonPropertyName("base_code")]
        public string? BaseCode { get; set; }

        [JsonPropertyName("rates")]
        public Dictionary<string, decimal>? Rates { get; set; }

        [JsonPropertyName("time_last_update_utc")]
        public string? TimeLastUpdateUtc { get; set; }
    }
}

public sealed class RatesException : Exception
{
    public RatesException(string message) : base(message)
    {
    }
}
