import "./App.css";
import BudgetTracker from "./BudgetTracker";
import ThemeProvider from "./ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      <BudgetTracker />
    </ThemeProvider>
  );
}

export default App;