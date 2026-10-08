using Microsoft.Extensions.DependencyInjection;

namespace CurrencyConverter;

public static class AppServices
{
    public static T Get<T>() where T : notnull
    {
        var services = IPlatformApplication.Current?.Services
            ?? throw new InvalidOperationException("Сервіси MAUI ще не ініціалізовано.");
        return services.GetRequiredService<T>();
    }
}
