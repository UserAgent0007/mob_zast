using CurrencyConverter.ViewModels;

namespace CurrencyConverter.Views;

public partial class RateDetailsPage : SessionPage
{
    public RateDetailsPage()
    {
        InitializeComponent();
        BindingContext = AppServices.Get<RateDetailsViewModel>();
    }
}
