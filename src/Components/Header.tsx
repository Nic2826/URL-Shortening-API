export default function Header() {
  return (
    <div className="header">
      <img className="header__logo" src="/public/images/logo.svg" alt="Logo" />
     
      <div className="header__nav-container">

        <nav className="header__nav">
          <p className="header__nav-item">Features</p>
          <p className="header__nav-item">Pricing</p>
          <p className="header__nav-item">Resources</p>
        </nav>

        <div className="header__nav-access">
          <button className="header__nav-login">Log in</button>
          <button className="header__nav-signup">Sign Up</button>
        </div>

      </div>
    </div>
  );
}
