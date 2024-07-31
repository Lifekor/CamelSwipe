import { useEffect } from 'react'

const RedirectToGame = () => {
  useEffect(() => {
    const redirect = () => {
      if (window.Telegram && window.Telegram.WebApp) {
        const webApp = window.Telegram.WebApp;

        // Проверьте, существует ли метод initData
        if (webApp.initData) {
          try {
            // Получаем данные из initData
            const telegramData = webApp.initData;
            console.log('Telegram Data:', telegramData); // Логирование данных для отладки
            localStorage.setItem('telegramData', JSON.stringify(telegramData));
          } catch (error) {
            console.error('Error retrieving Telegram data:', error);
          }
        } else {
          console.error('The initData is not available on Telegram.WebApp');
        }
      } else {
        console.error('Telegram.WebApp is not available');
      }

      const params = new URLSearchParams(window.location.search);
      const gameUrl = `https://lifekor.github.io/CamelSwipe/?${params.toString()}`;
      console.log('Redirecting to:', gameUrl); // Логирование URL для отладки
      window.location.href = gameUrl;
    };

    // Убедитесь, что SDK загружен и готов к использованию
    if (window.Telegram && window.Telegram.WebApp) {
      redirect();
    } else {
      console.error('Telegram.WebApp is not initialized');
    }
  }, []);

  return (
    <div className='text-2xl bg-myColor-800 h-[100vh] flex items-center justify-center text-white font-bold'>
      <p className='text-center'>Get ready, the game is starting...</p>
    </div>
  );
};

export default RedirectToGame;
