using CurrencyConverter.Core.Services;
using Microsoft.Extensions.DependencyInjection;

namespace CurrencyConverter;

public partial class App : Application
{
    public App()
    {
        InitializeComponent();
        UserAppTheme = AppTheme.Dark;
    }

    protected override Window CreateWindow(IActivationState? activationState)
    {
        return new Window(new AppShell());
    }

    protected override void OnStart()
    {
        base.OnStart();
        var session = IPlatformApplication.Current?.Services.GetService<AppSession>();
        if (session is not null)
        {
            _ = session.LoadRatesAsync();
        }
    }
}
