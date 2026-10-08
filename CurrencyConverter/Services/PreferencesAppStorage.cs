using CurrencyConverter.Core.Services;

namespace CurrencyConverter.Services;

public sealed class PreferencesAppStorage : IAppStorage
{
    public string? Read(string key)
    {
        return Preferences.Default.ContainsKey(key)
            ? Preferences.Default.Get(key, string.Empty)
            : null;
    }

    public void Write(string key, string value) => Preferences.Default.Set(key, value);
}
