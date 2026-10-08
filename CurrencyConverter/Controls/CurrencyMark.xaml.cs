using CurrencyConverter.Core.Data;

namespace CurrencyConverter.Controls;

public partial class CurrencyMark : ContentView
{
    public static readonly BindableProperty CodeProperty = BindableProperty.Create(
        nameof(Code), typeof(string), typeof(CurrencyMark), string.Empty, propertyChanged: OnChanged);

    public static readonly BindableProperty SizeProperty = BindableProperty.Create(
        nameof(Size), typeof(double), typeof(CurrencyMark), 40d, propertyChanged: OnChanged);

    public CurrencyMark()
    {
        InitializeComponent();
        Apply();
    }

    public string Code
    {
        get => (string)GetValue(CodeProperty);
        set => SetValue(CodeProperty, value);
    }

    public double Size
    {
        get => (double)GetValue(SizeProperty);
        set => SetValue(SizeProperty, value);
    }

    private static void OnChanged(BindableObject bindable, object oldValue, object newValue)
        => ((CurrencyMark)bindable).Apply();

    private void Apply()
    {
        if (SymbolLabel is null || MarkBorder is null)
        {
            return;
        }

        var currency = CurrencyCatalog.Get(string.IsNullOrWhiteSpace(Code) ? "?" : Code);
        SymbolLabel.Text = currency.Symbol;
        SymbolLabel.FontSize = currency.Symbol.Length > 2 ? 11 : Math.Max(12, Size * 0.38);
        MarkBorder.WidthRequest = Size;
        MarkBorder.HeightRequest = Size;
        MarkBorder.StrokeShape = new Microsoft.Maui.Controls.Shapes.RoundRectangle
        {
            CornerRadius = Size / 2,
        };
    }
}
