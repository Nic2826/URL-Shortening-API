import { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
type PopupWithFormProps = {
  PopupWithFormTitle: string;
  PopupWithFormInput: string;
  PopupWithFormInputPassword: string;
  buttonText: string;
  onClose?: () => void;
};
export default function PopupWithForm({
  PopupWithFormTitle,
  buttonText,
  PopupWithFormInput,
  PopupWithFormInputPassword,
  onClose,
}: PopupWithFormProps) {
  const { login } = useAuth();
  const [inputValue, setInputValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [inputError, setInputError] = useState("");
  const [isHidePassword, setIsHidePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,12}$/;

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
  setInputError("");
  // setPasswordError("");
  setLoading(true);

  // 2. Validar cada campo por separado
  let hasErrors = false;

  if (!passwordValue && !inputValue) {
    setInputError("Please fill out the fields");
    hasErrors = true;
setLoading(false);
  }else { 

    if (buttonText === "Sign Up" && inputValue && !inputValue.includes('@')) {
  setInputError('Please enter a valid email, it must includes @');
  hasErrors = true;
setLoading(false);
}else {
   if (!passwordRegex.test(passwordValue)) {
    setInputError('Password must contain 8–12 characters, at least 1 uppercase letter and 1 number.' );
    hasErrors = true;
    setLoading(false);
  }

}
  }
     
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

//-------------------------LOGIN EXITOSO--------------------------------------------------------
      if (response.ok) {
        console.log("✅ Éxito:", data);
        onClose?.(); // cerrar el PopupWithForm si todo sale bien
        login({
  username: data.username,
  email: data.email,
  id: data.id
});

        
      } else {
        console.error("❌ Error:", data.error);
        if(data.error === "User not found"){
 setInputError('Incorrect username or password');
    hasErrors = true;
    setLoading(false);
        }else{
          if(data.error === "Incorrect Password"){
 setInputError('Incorrect username or password');
    hasErrors = true;
    setLoading(false);
        }else{
          if(data.error === "User is already registered"){
            setInputError("This username is already registered");
    hasErrors = true;
    setLoading(false);
          }
        }
      }
   
      }
    } catch (err) {
      console.error("⚠️ Error del servidor:", err);
    }
  };

  return (
<>  
    <div className="PopupWithForm__overlay" onClick={handleOverlayClick}></div>
    <div className="PopupWithForm">
      <form className="PopupWithForm-form" typeof="submit" onSubmit={handleSubmit} noValidate >
        <p className="PopupWithForm-title">{PopupWithFormTitle}</p>

        <input 
        className={inputError ? "PopupWithForm-input PopupWithForm-input-error" : "PopupWithForm-input"} 
        type={buttonText === "Sign Up" ? "email" : "text"}
        placeholder={PopupWithFormInput} 
        value={inputValue}
        onChange={(e) => {setInputValue(e.target.value); setInputError(""); setLoading(false)} } />
       
        <input
          className={inputError ? "PopupWithForm-input PopupWithForm-input-error" : "PopupWithForm-input"}
          type={isHidePassword ? "text" : "password"}
          placeholder={PopupWithFormInputPassword}
          value={passwordValue}
          onChange={(e) => {setPasswordValue(e.target.value); setInputError(""); setLoading(false)}}
        />

        <span className="PopupWithForm-error">{inputError}</span>

        <div
          className={
            isHidePassword ? "PopupWithForm-password-hide" : "PopupWithForm-password-show"
          }
          onClick={handleClickEyeIcon}
        ></div>

        <div className="PopupWithForm-remember-container">
          <input className="PopupWithForm-remember-checkbox" type="checkbox"></input>
          <p className="PopupWithForm-remember-text">Remember me</p>
        </div>

        <button className="PopupWithForm-login-button" type="submit" >
          {loading? "Loading..." : buttonText}
        </button>
        <p className={"PopupWithForm-forgot"}>Forgot Password?</p>
        {/* <p className="PopupWithForm-text">Not a member Signup now</p> */}
        <div className="PopupWithForm__close-button" onClick={handleCloseButton}>
          {" "}
        </div>
      </form>
    </div>
    </>
  );
}
