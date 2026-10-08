namespace CurrencyConverter.Core.Services;

public interface IAppStorage
{
    string? Read(string key);

    void Write(string key, string value);
}
