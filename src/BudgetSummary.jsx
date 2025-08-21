import { Calculator } from "lucide-react";

const BudgetSummary = ({ totalBudget, totalSpent, remaining }) => {

  if (!totalBudget) {
    return null;
  }

  const budgetAmount = parseFloat(totalBudget);
  const isOverBudget = remaining < 0;
  const percentageSpent = budgetAmount > 0 ? (totalSpent / budgetAmount) * 100 : 0;

  return (
    <div className="card">
      <div className="section-header">
        <Calculator className="icon-purple" size={24} />
        <h2>Budget Summary</h2>
      </div>
      
     
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className={`progress-fill ${isOverBudget ? 'progress-over' : ''}`}
            style={{ 
              width: `${Math.min(percentageSpent, 100)}%` 
            }}
          ></div>
        </div>
        <p className="progress-text">
          {percentageSpent.toFixed(1)}% of budget used
        </p>
      </div>

   
      <div className="summary-grid">
        <div className="summary-card summary-card-blue">
          <p className="summary-label summary-label-blue">Total Budget</p>
          <p className="summary-value summary-value-blue">
            ${budgetAmount.toFixed(2)}
          </p>
        </div>
        
        <div className="summary-card summary-card-red">
          <p className="summary-label summary-label-red">Total Spent</p>
          <p className="summary-value summary-value-red">
            ${totalSpent.toFixed(2)}
          </p>
        </div>
        
        <div
          className={`summary-card ${
            remaining >= 0 ? "summary-card-green" : "summary-card-red"
          }`}
        >
          <p
            className={`summary-label ${
              remaining >= 0 ? "summary-label-green" : "summary-label-red"
            }`}
          >
            {remaining >= 0 ? "Remaining" : "Over Budget"}
          </p>
          <p
            className={`summary-value ${
              remaining >= 0 ? "summary-value-green" : "summary-value-red"
            }`}
          >
            ${Math.abs(remaining).toFixed(2)}
          </p>
        </div>
      </div>

    
      {isOverBudget && (
        <div className="budget-alert budget-alert-danger">
          ⚠️ You are ${Math.abs(remaining).toFixed(2)} over your budget!
        </div>
      )}
      
      {!isOverBudget && percentageSpent > 80 && (
        <div className="budget-alert budget-alert-warning">
          ⚡ You've used {percentageSpent.toFixed(1)}% of your budget. Consider monitoring your spending.
        </div>
      )}
    </div>
  );
};

export default BudgetSummary;