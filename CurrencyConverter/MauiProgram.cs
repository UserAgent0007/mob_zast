using CurrencyConverter.Core.Services;
using CurrencyConverter.Services;
using CurrencyConverter.ViewModels;
using Microsoft.Extensions.Logging;

namespace CurrencyConverter;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
            });

        builder.Services.AddSingleton(_ => new HttpClient
        {
            Timeout = TimeSpan.FromSeconds(20),
        });
        builder.Services.AddSingleton<IRatesClient, RatesClient>();
        builder.Services.AddSingleton<IAppStorage, PreferencesAppStorage>();
        builder.Services.AddSingleton<AppSession>();
        builder.Services.AddSingleton<ConverterViewModel>();
        builder.Services.AddSingleton<RatesViewModel>();
        builder.Services.AddSingleton<HistoryViewModel>();
        builder.Services.AddSingleton<SettingsViewModel>();
        builder.Services.AddSingleton<CurrencyPickerViewModel>();
        builder.Services.AddSingleton<RateDetailsViewModel>();

#if DEBUG
        builder.Logging.AddDebug();
#endif

        return builder.Build();
    }
}
