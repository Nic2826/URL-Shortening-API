
type PopupProps = {
  onClose?: () => void;
};
export default function Popup({ onClose }: PopupProps) {

  const handleCloseButton = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleOverlayClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
    <div className="Popup">
      
      <p className="Popup-message">
        

        <span>🔐 Please </span>
        
        <a className="Popup-message-link" href="/login"> log in </a>
         or 
         <a className="Popup-message-link" href="/signup"> sign up </a> to shorten more links.
      </p>
      <span className="Popup-message-gray">It's quick and free!</span>
      <div className="Popup__close-button" onClick={handleCloseButton}>
        {" "}
      </div>
      
    </div>
    <div className="Popup__overlay" onClick={handleOverlayClick}></div>
    </>
  );
}
