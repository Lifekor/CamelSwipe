import { useEffect } from 'react'
import { ErrorProvider, useError } from './requestProvider/errorContext'
import ErrorSnackbar from './requestProvider/errorSnackbar'
import Router from './router/router'

interface TelegramWebApp {
  close: () => void;
  expand: () => void;
  ready: () => void;
  setData: (data: any) => void;
  getData: () => any;
}

const tg: TelegramWebApp = (window as any).Telegram?.WebApp;

function App() {
  return (
    <ErrorProvider>
      <AppContent />
    </ErrorProvider>
  );
}

function AppContent() {
  useEffect(() => {
    if (tg) {
      tg.ready();

      // Восстановление состояния, если оно было сохранено
      const savedState = localStorage.getItem('telegramState');
      if (savedState) {
        const state = JSON.parse(savedState);
        tg.setData(state);
        localStorage.removeItem('telegramState');
      }
    }
  }, []);

  const { error, setError } = useError();

  return (
    <>
      <Router />
      <ErrorSnackbar error={error} onClose={() => setError('')} />
    </>
  );
}

export default App;
