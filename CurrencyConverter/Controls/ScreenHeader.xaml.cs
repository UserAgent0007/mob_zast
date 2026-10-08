namespace CurrencyConverter.Controls;

public partial class ScreenHeader : ContentView
{
    public static readonly BindableProperty KickerProperty = BindableProperty.Create(
        nameof(Kicker), typeof(string), typeof(ScreenHeader), string.Empty, propertyChanged: OnChanged);

    public static readonly BindableProperty TitleProperty = BindableProperty.Create(
        nameof(Title), typeof(string), typeof(ScreenHeader), string.Empty, propertyChanged: OnChanged);

    public static readonly BindableProperty SubtitleProperty = BindableProperty.Create(
        nameof(Subtitle), typeof(string), typeof(ScreenHeader), string.Empty, propertyChanged: OnChanged);

    public static readonly BindableProperty SubtitleColorProperty = BindableProperty.Create(
        nameof(SubtitleColor), typeof(Color), typeof(ScreenHeader), Color.FromArgb("#8AA399"), propertyChanged: OnChanged);

    public ScreenHeader()
    {
        InitializeComponent();
        Apply();
    }

    public string Kicker
    {
        get => (string)GetValue(KickerProperty);
        set => SetValue(KickerProperty, value);
    }

    public string Title
    {
        get => (string)GetValue(TitleProperty);
        set => SetValue(TitleProperty, value);
    }

    public string Subtitle
    {
        get => (string)GetValue(SubtitleProperty);
        set => SetValue(SubtitleProperty, value);
    }

    public Color SubtitleColor
    {
        get => (Color)GetValue(SubtitleColorProperty);
        set => SetValue(SubtitleColorProperty, value);
    }

    private static void OnChanged(BindableObject bindable, object oldValue, object newValue)
        => ((ScreenHeader)bindable).Apply();

    private void Apply()
    {
        if (KickerLabel is null)
        {
            return;
        }

        KickerLabel.Text = string.IsNullOrWhiteSpace(Kicker) ? string.Empty : Kicker.ToUpperInvariant();
        TitleLabel.Text = Title;
        SubtitleLabel.Text = Subtitle;
        SubtitleLabel.TextColor = SubtitleColor;
        SubtitleLabel.IsVisible = !string.IsNullOrWhiteSpace(Subtitle);
    }
}
