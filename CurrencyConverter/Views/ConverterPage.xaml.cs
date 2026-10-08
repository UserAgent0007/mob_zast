using CurrencyConverter.ViewModels;

namespace CurrencyConverter.Views;

public partial class ConverterPage : SessionPage
{
    public ConverterPage()
    {
        InitializeComponent();
        BindingContext = AppServices.Get<ConverterViewModel>();
    }
}
