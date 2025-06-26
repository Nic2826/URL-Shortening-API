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
  const [inputValue, setInputValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isHidePassword, setIsHidePassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint = buttonText === "Sign Up" ? "signup" : "login";

    const requestBody =
      buttonText === "Sign Up"
        ? { email: inputValue, password: passwordValue }
        : { username: inputValue, password: passwordValue };

    // 1. Limpiar errores previos
  setEmailError("");
  setPasswordError("");
  setLoading(true);

  // 2. Validar cada campo por separado
  let hasErrors = false;

  if (!inputValue) {
    setEmailError("Please fill out the field");
    hasErrors = true;
    setLoading(false);

  }

  if (!passwordValue) {
    setPasswordError("Please fill out the field");
    hasErrors = true;
setLoading(false);
  }

 

  if (buttonText === "Sign Up" && inputValue && !inputValue.includes('@')) {
  setEmailError('Please enter a valid email, it must includes @');
  hasErrors = true;
setLoading(false);
}

// if (passwordValue && passwordValue.length < 6) {
//   setPasswordError('Password must be at least 6 characters');
//   hasErrors = true;
//   setLoading(false);
// }
      
 // 3. Si hay errores, no continuar
  if (hasErrors) {
    setLoading(false);
    return;
  }
  

    try {
      const response = await fetch(`http://localhost:3001/api/auth/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Éxito:", data);
        onClose?.(); // cerrar el popup si todo sale bien
      } else {
        console.error("❌ Error:", data.error);
        if(data.error === "User not found"){
 setEmailError(data.error);
    hasErrors = true;
    setLoading(false);
        }else{
          if(data.error === "Incorrect Password"){
 setPasswordError(data.error);
    hasErrors = true;
    setLoading(false);
        }}
   
      }
    } catch (err) {
      console.error("⚠️ Error del servidor:", err);
    }
  };

  return (
    <div className="popup">
      <div className="popup__overlay" onClick={handleOverlayClick}></div>
      <form className="popup-form" typeof="submit" onSubmit={handleSubmit} noValidate >
        <p className="popup-title">{popupTitle}</p>

        <input 
        className={emailError ? "popup-input popup-input-error" : "popup-input"} 
        type={buttonText === "Sign Up" ? "email" : "text"}
        placeholder={popupInput} 
        value={inputValue}
        onChange={(e) => {setInputValue(e.target.value); setEmailError(""); setLoading(false)} } />

<span className="popup-error-email">{emailError}</span>
       
        <input
          className={passwordError ? "popup-input popup-input-error" : "popup-input"}
          type={isHidePassword ? "text" : "password"}
          placeholder={popupInputPassword}
          value={passwordValue}
          onChange={(e) => {setPasswordValue(e.target.value); setPasswordError(""); setLoading(false)}}
        />

        <span className="popup-error-password">{passwordError}</span>

        <div
          className={
            isHidePassword ? "popup-password-hide" : "popup-password-show"
          }
          onClick={handleClickEyeIcon}
        ></div>

        <div className="popup-remember-container">
          <input className="popup-remember-checkbox" type="checkbox"></input>
          <p className="popup-remember-text">Remember me</p>
        </div>

        <button className="popup-login-button" type="submit" >
          {loading? "Loading..." : buttonText}
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
