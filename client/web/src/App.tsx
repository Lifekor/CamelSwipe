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
  initData?: any;
}

const tg: TelegramWebApp | undefined = (window as any).Telegram?.WebApp;

function App() {
  useEffect(() => {
    // Восстановление данных Telegram при возврате в приложение
    const initializeTelegram = () => {
      const savedData = localStorage.getItem('telegramData');
      if (savedData) {
        const telegramData = JSON.parse(savedData);
        if (tg) {
          tg.initData = telegramData;
        }
        // Очистить сохраненные данные после восстановления
        localStorage.removeItem('telegramData');
      }
    };

    initializeTelegram();
  }, []);

  return (
    <ErrorProvider>
      <AppContent />
    </ErrorProvider>
  );
}

function AppContent() {
  const { error, setError } = useError();

  return (
    <>
      <Router />
      <ErrorSnackbar error={error} onClose={() => setError('')} />
    </>
  );
}

export default App;
