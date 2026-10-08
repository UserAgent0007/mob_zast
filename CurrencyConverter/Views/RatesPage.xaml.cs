using CurrencyConverter.ViewModels;

namespace CurrencyConverter.Views;

public partial class RatesPage : SessionPage
{
    public RatesPage()
    {
        InitializeComponent();
        BindingContext = AppServices.Get<RatesViewModel>();
    }
}
