using CurrencyConverter.Views;

namespace CurrencyConverter;

public partial class AppShell : Shell
{
    public AppShell()
    {
        InitializeComponent();
        Routing.RegisterRoute(nameof(CurrencyPickerPage), typeof(CurrencyPickerPage));
        Routing.RegisterRoute(nameof(RateDetailsPage), typeof(RateDetailsPage));
    }
}
