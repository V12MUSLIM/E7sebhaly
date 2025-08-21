import "./Hero.css";
import logo from "./assets/logo.png"; 

export default function Hero() {
  return (
    <>
      <div className="hero-section">
        <img src={logo} alt="E7sbahly Logo" className="hero-logo" />
        <p className="hero-subtitle">
          Manage your budget, and track your expenses.
        </p>
      </div>
    </>
  );
}