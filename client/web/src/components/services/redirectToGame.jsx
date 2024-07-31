import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
const RedirectToGame = ({ url }) => {
  const navigate = useNavigate()
  useEffect(() => {
    // Скрыть скролл на странице
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Восстановить скролл после размонтирования компонента
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '111vh' }}>
      <iframe 
        src={url} 
        style={{ 
          border: 'none', 
          width: '100%', 
          height: '100%', 
          position: 'absolute', 
          top: 0, 
          left: 0 
        }} 
        title="Iframe Example"
      ></iframe>
      <button 
        style={{ 
          position: 'absolute', 
          top: '25px', 
          left: '10px', 
          padding: '5px 10px', 
          background: 'linear-gradient(135deg, #D1852D, #995A12)', 
          color: 'white', 
          border: '1px solid white', 
          borderRadius: '15px', 
          cursor: 'pointer',
          fontWeight: 700
        }}
        onClick={() => navigate('/boost')}
      >
        Go to menu
      </button>
    </div>
  );
};

export default RedirectToGame;
