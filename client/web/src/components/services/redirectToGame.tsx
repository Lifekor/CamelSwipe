import { useEffect } from 'react'

const RedirectToGame = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gameUrl = `https://lifekor.github.io/CamelSwipe/?${params.toString()}`;
    window.location.href = gameUrl;
  }, []);

  return <div>Redirecting...</div>;
};

export default RedirectToGame;
