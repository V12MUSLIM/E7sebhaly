import { DollarSign } from "lucide-react";
export default function BudgetInput({ totalBudget, onBudgetChange }) {
  return (
    <>
      <div className="card">
        <div className="section-header">
        <DollarSign className="icon-green" size={24} />
        <h2>Set your budget</h2>
      </div>
      <div className="input-group">
        <div className="input-flex">
          <input
            type="number"
            placeholder="Enter tottal budget..."
            value={totalBudget}
            onChange={(e) => onBudgetChange(e.target.value)}
            className="input"
          />
        </div>
      </div>
      </div>
    </>
  );
}
