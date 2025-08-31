import "./BudgetTracker.css";
import logo from "./assets/logo.png"; 
import { useTheme } from "./ThemeProvider";

export default function Hero() {
  const { dark } = useTheme(); // الحصول على حالة الثيم

  return (
    <>
      <div className={`hero-section ${dark ? '' : 'light'}`}> {/* إضافة كلاس ديناميكي */}
        <img src={logo} alt="E7sbahly Logo" className="hero-logo" />
        <p className="hero-subtitle">
          Manage your budget, and track your expenses.
        </p>
      </div>
    </>
  );
}