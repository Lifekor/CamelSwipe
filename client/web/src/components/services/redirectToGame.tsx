import { useEffect } from 'react'

const RedirectToGame = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gameUrl = `https://lifekor.github.io/CamelSwipe/?${params.toString()}`;
    window.location.href = gameUrl;
  }, []);

  return <div className='text-2xl bg-myColor-800 h-[100vh] flex items-center justify-center text-white font-bold'>
    <p className='text-center'>Get ready, the game is starting...</p>
    </div>;
};

export default RedirectToGame;
