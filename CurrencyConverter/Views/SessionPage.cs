using CurrencyConverter.ViewModels;

namespace CurrencyConverter.Views;

public class SessionPage : ContentPage
{
    protected override void OnAppearing()
    {
        base.OnAppearing();
        if (BindingContext is SessionViewModel viewModel)
        {
            viewModel.Activate();
        }
    }

    protected override void OnDisappearing()
    {
        if (BindingContext is SessionViewModel viewModel)
        {
            viewModel.Deactivate();
        }

        base.OnDisappearing();
    }
}
