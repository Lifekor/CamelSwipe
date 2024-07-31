
const RedirectToGame = ({ url }) => {
  return (
    <iframe 
      src={url} 
      style={{ 
        border: "none", 
        width: "100vw", 
        height: "112vh", 
        position: "fixed", 
        top: 0, 
        left: 0 
      }} 
      title="Iframe Example"
    ></iframe>
  );
};

export default RedirectToGame;
