namespace CurrencyConverter.Core.Services;

public sealed class MemoryAppStorage : IAppStorage
{
    private readonly Dictionary<string, string> _values = new(StringComparer.Ordinal);

    public string? Read(string key) => _values.TryGetValue(key, out var value) ? value : null;

    public void Write(string key, string value) => _values[key] = value;
}
