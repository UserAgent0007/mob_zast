using CurrencyConverter.ViewModels;

namespace CurrencyConverter.Views;

public partial class HistoryPage : SessionPage
{
    public HistoryPage()
    {
        InitializeComponent();
        BindingContext = AppServices.Get<HistoryViewModel>();
    }
}
