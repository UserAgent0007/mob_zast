using CurrencyConverter.ViewModels;

namespace CurrencyConverter.Views;

public partial class CurrencyPickerPage : SessionPage
{
    public CurrencyPickerPage()
    {
        InitializeComponent();
        BindingContext = AppServices.Get<CurrencyPickerViewModel>();
    }

    protected override void OnAppearing()
    {
        if (BindingContext is CurrencyPickerViewModel picker)
        {
            picker.Query = string.Empty;
        }

        base.OnAppearing();
    }
}
