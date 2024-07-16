import { ErrorProvider, useError } from './requestProvider/errorContext'
import ErrorSnackbar from './requestProvider/errorSnackbar'
import Router from './router/router'

interface TelegramWebApp {
	close: () => void;
  expand: () => void
}

const tg: TelegramWebApp = (window as any).Telegram.WebApp;

function App() {
  return (
   <>
   <ErrorProvider>
      <AppContent/>
   </ErrorProvider>
   </>
  );
}

function AppContent() {
  const { error, setError } = useError();
  return (
    <>
    <Router/>
    <ErrorSnackbar error={error} onClose={() => setError('')} />
    </>
  )
}

export default App;
