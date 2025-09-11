import Login from "./Login";
import Signup from "./Signup";
import {useState } from "react";
import { useAuth } from "../Contexts/AuthContext";

export default function Header() {
  const [isLoginClicked, setIsLoginClicked] = useState(false);
  const [isSignupClicked, setIsSignupClicked] = useState(false);
  const { isLoggedIn, logout, userInfo } = useAuth();

// setIsLoginClicked(false);
  const handleLoginClick = () => {
    !isLoggedIn && setIsLoginClicked(true);
    setIsSignupClicked(false);
    
  };

  const handleSignupClick = () => {
    if(!isLoggedIn){
      setIsSignupClicked(true);
    setIsLoginClicked(false);
    }else{
      // Aquí llamamos a la función logout del contexto para cerrar sesión
      logout();
      // También podemos cerrar cualquier popup abierto
      setIsLoginClicked(false);
      setIsSignupClicked(false);
}
  };

  const handleClosePopupWithForm = () => {   
    setIsLoginClicked(false);
    setIsSignupClicked(false);
  };
  return (
    <div className="header">
      <img className="header__logo" src="/public/images/logo.svg" alt="Logo" />

      <div className="header__nav-container">
        <nav className="header__nav">
          <p className="header__nav-item">Features</p>
          <p className="header__nav-item">Pricing</p>
          <p className="header__nav-item">Resources</p>
        </nav>

        <div className="header__access">
          <button className="header__access-login" onClick={handleLoginClick}>{isLoggedIn && userInfo ? `${userInfo.username}` : "Log in"}</button>
          <button className="header__access-signup" onClick={handleSignupClick}>{isLoggedIn ? "Sign out" : "Sign Up"}</button>
        </div>
        
      </div>
      {isLoginClicked?<Login onClose={handleClosePopupWithForm}/>: ""}
        {isSignupClicked?<Signup onClose={handleClosePopupWithForm}/>:""}
    </div>
  );
}
