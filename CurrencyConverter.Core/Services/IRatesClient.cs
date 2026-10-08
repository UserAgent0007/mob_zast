using CurrencyConverter.Core.Models;

namespace CurrencyConverter.Core.Services;

public interface IRatesClient
{
    Task<RatesSnapshot> FetchLatestAsync(string baseCode = "USD", CancellationToken cancellationToken = default);
}
