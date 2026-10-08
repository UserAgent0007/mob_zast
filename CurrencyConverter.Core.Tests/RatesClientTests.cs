using System.Net;
using CurrencyConverter.Core.Services;

namespace CurrencyConverter.Core.Tests;

public class RatesClientTests
{
    [Fact]
    public async Task FetchLatest_reads_a_successful_payload()
    {
        const string json = """
            {
              "result": "success",
              "base_code": "USD",
              "time_last_update_utc": "Wed, 07 Oct 2026 00:00:01 +0000",
              "rates": { "USD": 1, "UAH": 41.25, "EUR": 0.91 }
            }
            """;
        var client = new RatesClient(new HttpClient(new StubHandler(HttpStatusCode.OK, json)));

        var snapshot = await client.FetchLatestAsync();

        Assert.Equal("USD", snapshot.Base);
        Assert.Equal(41.25m, snapshot.Rates["UAH"]);
        Assert.Equal("ExchangeRate-API", snapshot.Provider);
    }

    [Fact]
    public async Task FetchLatest_rejects_an_unreadable_payload()
    {
        var client = new RatesClient(new HttpClient(new StubHandler(HttpStatusCode.OK, """{"result":"error"}""")));

        var error = await Assert.ThrowsAsync<RatesException>(() => client.FetchLatestAsync());

        Assert.Equal("Не вдалося прочитати відповідь сервісу курсів.", error.Message);
    }

    [Fact]
    public async Task FetchLatest_rejects_a_failed_status()
    {
        var client = new RatesClient(new HttpClient(new StubHandler(HttpStatusCode.ServiceUnavailable, "")));

        var error = await Assert.ThrowsAsync<RatesException>(() => client.FetchLatestAsync());

        Assert.Equal("Сервіс курсів тимчасово недоступний.", error.Message);
    }

    private sealed class StubHandler : HttpMessageHandler
    {
        private readonly HttpStatusCode _status;
        private readonly string _body;

        public StubHandler(HttpStatusCode status, string body)
        {
            _status = status;
            _body = body;
        }

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var response = new HttpResponseMessage(_status)
            {
                Content = new StringContent(_body),
            };
            return Task.FromResult(response);
        }
    }
}
