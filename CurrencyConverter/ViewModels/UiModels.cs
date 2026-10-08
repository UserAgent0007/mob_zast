namespace CurrencyConverter.ViewModels;

public sealed class PopularPair
{
    public required string Code { get; init; }

    public required string Label { get; init; }
}

public sealed class RateRowItem
{
    public required string Code { get; init; }

    public required string Name { get; init; }

    public required string ValueText { get; init; }

    public required bool IsFavorite { get; init; }

    public string Star => IsFavorite ? "★" : "☆";

    public Color StarColor => IsFavorite ? Color.FromArgb("#E4B15A") : Color.FromArgb("#8AA399");
}

public sealed class CurrencyRowItem
{
    public required string Code { get; init; }

    public required string Name { get; init; }

    public required bool IsFavorite { get; init; }

    public string Star => IsFavorite ? "★" : "☆";

    public Color StarColor => IsFavorite ? Color.FromArgb("#E4B15A") : Color.FromArgb("#8AA399");
}

public sealed class HistoryRow
{
    public required string Id { get; init; }

    public required string From { get; init; }

    public required string To { get; init; }

    public required decimal Amount { get; init; }

    public required string PairText { get; init; }

    public required string ResultText { get; init; }

    public required string RateText { get; init; }

    public required string TimeText { get; init; }
}

public sealed class SampleLine
{
    public required string FromText { get; init; }

    public required string ToText { get; init; }
}

public sealed class FavoriteChip
{
    public required string Code { get; init; }
}
