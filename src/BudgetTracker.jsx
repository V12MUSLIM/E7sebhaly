import  { useState } from "react";
import BudgetInput from "./BudgetInput";
import ItemManager from "./ItemManager";
import BudgetSummary from "./BudgetSummary";
import ReportDownloader from "./ReportDownloader";
import "./BudgetTracker.css";

const BudgetTracker = () => {
  const [totalBudget, setTotalBudget] = useState("");
  const [items, setItems] = useState([]);

  
  const totalSpent = items.reduce((sum, item) => sum + item.cost, 0);
  const remaining = totalBudget ? parseFloat(totalBudget) - totalSpent : 0;

  const handleBudgetChange = (value) => {
    setTotalBudget(value);
  };

  const handleAddItem = (newItem) => {
    setItems(prevItems => [...prevItems, newItem]);
  };

  const handleRemoveItem = (itemId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  return (
    <div className="budget-tracker">
      <div className="container">

        <BudgetInput 
          totalBudget={totalBudget}
          onBudgetChange={handleBudgetChange}
        />

        <ItemManager 
          items={items}
          onAddItem={handleAddItem}
          onRemoveItem={handleRemoveItem}
        />

        <BudgetSummary 
          totalBudget={totalBudget}
          totalSpent={totalSpent}
          remaining={remaining}
        />

        <ReportDownloader 
          totalBudget={totalBudget}
          items={items}
          totalSpent={totalSpent}
          remaining={remaining}
        />
      </div>
    </div>
  );
};

export default BudgetTracker;