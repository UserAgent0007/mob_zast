using CommunityToolkit.Mvvm.ComponentModel;
using CurrencyConverter.Core.Services;

namespace CurrencyConverter.ViewModels;

public abstract partial class SessionViewModel : ObservableObject
{
    private bool _active;

    protected SessionViewModel(AppSession session)
    {
        Session = session;
    }

    protected AppSession Session { get; }

    public void Activate()
    {
        if (_active)
        {
            Refresh();
            return;
        }

        _active = true;
        Session.Changed += OnSessionChanged;
        Refresh();
    }

    public void Deactivate()
    {
        if (!_active)
        {
            return;
        }

        _active = false;
        Session.Changed -= OnSessionChanged;
        OnDeactivated();
    }

    protected virtual void OnDeactivated()
    {
    }

    protected abstract void Refresh();

    private void OnSessionChanged()
    {
        if (MainThread.IsMainThread)
        {
            Refresh();
            return;
        }

        MainThread.BeginInvokeOnMainThread(Refresh);
    }
}
