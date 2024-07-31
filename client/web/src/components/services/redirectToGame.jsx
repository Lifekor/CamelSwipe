import { useEffect } from 'react'

const RedirectToGame = () => {
  useEffect(() => {
    const redirect = () => {
      if (window.Telegram && window.Telegram.WebApp) {
        const telegramData = window.Telegram.WebApp.getData();
        localStorage.setItem('telegramData', JSON.stringify(telegramData));
      }

      const params = new URLSearchParams(window.location.search);
      const gameUrl = `https://spa.camelracing.io/boost/?${params.toString()}`;
      console.log(gameUrl);
      window.location.href = gameUrl;
    };

    redirect();
  }, []);

  return (
    <div className='text-2xl bg-myColor-800 h-[100vh] flex items-center justify-center text-white font-bold'>
      <p className='text-center'>Get ready, the game is starting...</p>
    </div>
  );
};

export default RedirectToGame;
