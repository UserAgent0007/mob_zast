using CurrencyConverter.ViewModels;

namespace CurrencyConverter.Views;

public partial class SettingsPage : SessionPage
{
    public SettingsPage()
    {
        InitializeComponent();
        BindingContext = AppServices.Get<SettingsViewModel>();
    }
}
