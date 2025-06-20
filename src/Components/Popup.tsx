import { useState } from "react";
type popupProps = {
  popupTitle: string;
  popupInput: string;
  popupInputPassword: string;
  buttonText: string;
  onClose?: () => void;
};
export default function popup({
  popupTitle,
  buttonText,
  popupInput,
  popupInputPassword,
  onClose,
}: popupProps) {
  const [isHidePassword, setIsHidePassword] = useState(false);
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

  const handleClickEyeIcon = () => {
    setIsHidePassword(!isHidePassword);
  };

  return (
    //  <div className={isClosedClicked?"popup popup-hidden":"popup "}>
    <div className="popup">
      <div className="popup__overlay" onClick={handleOverlayClick}></div>
      <form className="popup-form" typeof="submit">
        <p className="popup-title">{popupTitle}</p>
        <input className="popup-input" type="text" placeholder={popupInput} />

        <input
          className="popup-input"
          type={isHidePassword ? "text" : "password"}
          placeholder={popupInputPassword}
        />
        <div className={isHidePassword ? "popup-password-hide" : "popup-password-show"} onClick={handleClickEyeIcon}></div>
        

        <div className="popup-remember-container">
          <input className="popup-remember-checkbox" type="checkbox"></input>
          <p className="popup-remember-text">Remember me</p>
        </div>

        <button className="popup-login-button" type="submit">
          {buttonText}
        </button>
        <p className={"popup-forgot"}>Forgot Password?</p>
        {/* <p className="popup-text">Not a member Signup now</p> */}
        <div className="popup__close-button" onClick={handleCloseButton}>
          {" "}
        </div>
      </form>
    </div>
  );
}
