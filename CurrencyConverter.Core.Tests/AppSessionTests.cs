using CurrencyConverter.Core.Models;
using CurrencyConverter.Core.Services;

namespace CurrencyConverter.Core.Tests;

public class AppSessionTests
{
    [Fact]
    public void SetFrom_swaps_when_the_same_code_is_already_selected()
    {
        var session = CreateSession();

        session.SetFrom("USD");

        Assert.Equal("USD", session.From);
        Assert.Equal("UAH", session.To);
    }

    [Fact]
    public void ToggleFavorite_keeps_the_last_currency()
    {
        var session = CreateSession();
        foreach (var code in session.Favorites.ToList())
        {
            session.ToggleFavorite(code);
        }

        Assert.Single(session.Favorites);
    }

    [Fact]
    public void History_is_newest_first_and_capped()
    {
        var session = CreateSession();
        for (var index = 0; index < 45; index++)
        {
            session.AddHistoryItem(Sample(index.ToString()));
        }

        Assert.Equal(40, session.History.Count);
        Assert.Equal("44", session.History[0].Id);
        Assert.DoesNotContain(session.History, item => item.Id == "0");

        session.RemoveHistoryItem("44");
        Assert.Equal(39, session.History.Count);

        session.ClearHistory();
        Assert.Empty(session.History);
    }

    [Fact]
    public async Task LoadRates_stores_snapshot_and_survives_restart()
    {
        var storage = new MemoryAppStorage();
        var client = new FakeRatesClient();
        var session = new AppSession(client, storage);

        await session.LoadRatesAsync();

        Assert.Equal("succeeded", session.Status);
        Assert.Equal(41.2m, session.Rates["UAH"]);
        Assert.Equal("ExchangeRate-API", session.Provider);

        var restored = new AppSession(client, storage);
        Assert.Equal(41.2m, restored.Rates["UAH"]);
        Assert.Equal("UAH", restored.From);
    }

    [Fact]
    public async Task LoadRates_keeps_previous_table_when_request_fails()
    {
        var storage = new MemoryAppStorage();
        var client = new FakeRatesClient();
        var session = new AppSession(client, storage);
        await session.LoadRatesAsync();

        client.FailNext = true;
        await session.LoadRatesAsync();

        Assert.Equal("failed", session.Status);
        Assert.Equal("Немає з’єднання з сервісом курсів. Перевірте мережу.", session.Error);
        Assert.Equal(41.2m, session.Rates["UAH"]);
    }

    private static AppSession CreateSession() => new(new FakeRatesClient(), new MemoryAppStorage());

    private static HistoryItem Sample(string id) => new(
        id, "UAH", "USD", 1000, 25, 0.025m, "1000", "25", "0,025", "2026-10-07T12:00:00Z", "07 жовт. 15:00");

    private sealed class FakeRatesClient : IRatesClient
    {
        public bool FailNext { get; set; }

        public Task<RatesSnapshot> FetchLatestAsync(string baseCode = "USD", CancellationToken cancellationToken = default)
        {
            if (FailNext)
            {
                FailNext = false;
                throw new RatesException("Немає з’єднання з сервісом курсів. Перевірте мережу.");
            }

            IReadOnlyDictionary<string, decimal> rates = new Dictionary<string, decimal>
            {
                ["USD"] = 1m,
                ["UAH"] = 41.2m,
                ["EUR"] = 0.92m,
            };
            return Task.FromResult(new RatesSnapshot(baseCode, rates, "2026-10-07T12:00:00Z", "ExchangeRate-API"));
        }
    }
}
