import Login from "./Login";
import Signup from "./Signup";
import {useState } from "react";


export default function Header() {
  const [isLoginClicked, setIsLoginClicked] = useState(false);
  const [isSignupClicked, setIsSignupClicked] = useState(false);

// setIsLoginClicked(false);
  const handleLoginClick = () => {
    setIsLoginClicked(true);
    setIsSignupClicked(false);
  };

  const handleSignupClick = () => {
    setIsSignupClicked(true);
    setIsLoginClicked(false);
  };

  const handleClosePopup = () => {
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
          <button className="header__access-login" onClick={handleLoginClick}>Log in</button>
          <button className="header__access-signup" onClick={handleSignupClick}>Sign Up</button>
        </div>
        
      </div>
      {isLoginClicked?<Login onClose={handleClosePopup}/>: ""}
        {isSignupClicked?<Signup onClose={handleClosePopup}/>:""}
    </div>
  );
}
