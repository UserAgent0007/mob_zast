using System.Text.Json;
using CurrencyConverter.Core.Data;
using CurrencyConverter.Core.Models;

namespace CurrencyConverter.Core.Services;

public sealed class AppSession
{
    private const string SettingsKey = "currency.settings";
    private const string HistoryKey = "currency.history";
    private const string RatesKey = "currency.rates";
    private const int HistoryLimit = 40;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };

    private readonly IRatesClient _ratesClient;
    private readonly IAppStorage _storage;

    public AppSession(IRatesClient ratesClient, IAppStorage storage)
    {
        _ratesClient = ratesClient;
        _storage = storage;
        Favorites = CurrencyCatalog.DefaultFavorites.ToList();
        History = [];
        Rates = new Dictionary<string, decimal>();
        Load();
    }

    public event Action? Changed;

    public string From { get; private set; } = "UAH";

    public string To { get; private set; } = "USD";

    public string Amount { get; private set; } = "1000";

    public int Decimals { get; private set; } = 2;

    public string DisplayBase { get; private set; } = "UAH";

    public List<string> Favorites { get; }

    public List<HistoryItem> History { get; }

    public string RatesBase { get; private set; } = "USD";

    public Dictionary<string, decimal> Rates { get; private set; }

    public string? UpdatedAt { get; private set; }

    public string Provider { get; private set; } = string.Empty;

    public string Status { get; private set; } = "idle";

    public string? Error { get; private set; }

    public void SetAmount(string value)
    {
        Amount = value ?? string.Empty;
        PersistSettings();
        Notify();
    }

    public void SetFrom(string code)
    {
        if (code == To)
        {
            To = From;
        }

        From = code;
        PersistSettings();
        Notify();
    }

    public void SetTo(string code)
    {
        if (code == From)
        {
            From = To;
        }

        To = code;
        PersistSettings();
        Notify();
    }

    public void SetPair(string from, string to, string? amount = null)
    {
        From = from;
        To = to;
        if (amount is not null)
        {
            Amount = amount;
        }

        PersistSettings();
        Notify();
    }

    public void SwapCurrencies()
    {
        (From, To) = (To, From);
        PersistSettings();
        Notify();
    }

    public void SetDecimals(int value)
    {
        Decimals = value;
        PersistSettings();
        Notify();
    }

    public void SetDisplayBase(string code)
    {
        DisplayBase = code;
        PersistSettings();
        Notify();
    }

    public void ToggleFavorite(string code)
    {
        if (Favorites.Contains(code))
        {
            if (Favorites.Count > 1)
            {
                Favorites.Remove(code);
            }
        }
        else
        {
            Favorites.Add(code);
        }

        PersistSettings();
        Notify();
    }

    public void AddHistoryItem(HistoryItem item)
    {
        History.Insert(0, item);
        if (History.Count > HistoryLimit)
        {
            History.RemoveRange(HistoryLimit, History.Count - HistoryLimit);
        }

        PersistHistory();
        Notify();
    }

    public void RemoveHistoryItem(string id)
    {
        History.RemoveAll(item => item.Id == id);
        PersistHistory();
        Notify();
    }

    public void ClearHistory()
    {
        History.Clear();
        PersistHistory();
        Notify();
    }

    public async Task LoadRatesAsync(string? baseCode = null, CancellationToken cancellationToken = default)
    {
        Status = "loading";
        Error = null;
        Notify();

        try
        {
            var snapshot = await _ratesClient.FetchLatestAsync(baseCode ?? "USD", cancellationToken);
            RatesBase = snapshot.Base;
            Rates = new Dictionary<string, decimal>(snapshot.Rates);
            UpdatedAt = snapshot.UpdatedAt;
            Provider = snapshot.Provider;
            Status = "succeeded";
            Error = null;
            PersistRates();
        }
        catch (RatesException exception)
        {
            Status = "failed";
            Error = exception.Message;
        }
        catch (Exception)
        {
            Status = "failed";
            Error = "Невідома помилка завантаження курсів.";
        }

        Notify();
    }

    private void Load()
    {
        try
        {
            var settingsJson = _storage.Read(SettingsKey);
            if (!string.IsNullOrWhiteSpace(settingsJson))
            {
                var settings = JsonSerializer.Deserialize<StoredSettings>(settingsJson, JsonOptions);
                if (settings is not null)
                {
                    From = string.IsNullOrWhiteSpace(settings.From) ? From : settings.From;
                    To = string.IsNullOrWhiteSpace(settings.To) ? To : settings.To;
                    Amount = settings.Amount ?? Amount;
                    Decimals = settings.Decimals is 2 or 4 or 6 ? settings.Decimals : Decimals;
                    DisplayBase = string.IsNullOrWhiteSpace(settings.DisplayBase) ? DisplayBase : settings.DisplayBase;
                    if (settings.Favorites is { Count: > 0 })
                    {
                        Favorites.Clear();
                        Favorites.AddRange(settings.Favorites.Distinct());
                    }
                }
            }

            var historyJson = _storage.Read(HistoryKey);
            if (!string.IsNullOrWhiteSpace(historyJson))
            {
                var history = JsonSerializer.Deserialize<List<HistoryItem>>(historyJson, JsonOptions);
                if (history is not null)
                {
                    History.AddRange(history.Take(HistoryLimit));
                }
            }

            var ratesJson = _storage.Read(RatesKey);
            if (!string.IsNullOrWhiteSpace(ratesJson))
            {
                var rates = JsonSerializer.Deserialize<StoredRates>(ratesJson, JsonOptions);
                if (rates?.Rates is { Count: > 0 })
                {
                    RatesBase = rates.Base ?? RatesBase;
                    Rates = rates.Rates;
                    UpdatedAt = rates.UpdatedAt;
                    Provider = rates.Provider ?? Provider;
                }
            }
        }
        catch (Exception)
        {
            // Пошкоджені збережені дані не блокують запуск.
        }
    }

    private void PersistSettings()
    {
        try
        {
            PersistSettingsCore();
        }
        catch
        {
            // Локальне сховище може бути недоступне до появи вікна.
        }
    }

    private void PersistSettingsCore()
    {
        var payload = new StoredSettings
        {
            From = From,
            To = To,
            Amount = Amount,
            Decimals = Decimals,
            DisplayBase = DisplayBase,
            Favorites = Favorites.ToList(),
        };
        _storage.Write(SettingsKey, JsonSerializer.Serialize(payload, JsonOptions));
    }

    private void PersistHistory()
    {
        try
        {
            _storage.Write(HistoryKey, JsonSerializer.Serialize(History, JsonOptions));
        }
        catch
        {
            // Локальне сховище може бути недоступне до появи вікна.
        }
    }

    private void PersistRates()
    {
        try
        {
            PersistRatesCore();
        }
        catch
        {
            // Локальне сховище може бути недоступне до появи вікна.
        }
    }

    private void PersistRatesCore()
    {
        var payload = new StoredRates
        {
            Base = RatesBase,
            Rates = Rates,
            UpdatedAt = UpdatedAt,
            Provider = Provider,
        };
        _storage.Write(RatesKey, JsonSerializer.Serialize(payload, JsonOptions));
    }

    private void Notify() => Changed?.Invoke();

    private sealed class StoredSettings
    {
        public string? From { get; set; }

        public string? To { get; set; }

        public string? Amount { get; set; }

        public int Decimals { get; set; }

        public string? DisplayBase { get; set; }

        public List<string>? Favorites { get; set; }
    }

    private sealed class StoredRates
    {
        public string? Base { get; set; }

        public Dictionary<string, decimal>? Rates { get; set; }

        public string? UpdatedAt { get; set; }

        public string? Provider { get; set; }
    }
}
