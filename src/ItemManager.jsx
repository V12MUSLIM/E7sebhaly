import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Switch from '@mui/material/Switch';

export default function ItemManager({ items, onAddItem, onRemoveItem }) {
  const [itemName, setItemName] = useState("");
  const [itemCost, setItemCost] = useState("");
  const [vatEnabled, setVatEnabled] = useState(false);
  function handleAddItem() {
    if (itemName.trim() && itemCost.trim() && !isNaN(parseFloat(itemCost))) {
      const newItem = {
        id: Date.now(),
        name: itemName.trim(),
        cost: parseFloat(itemCost),
      };
      onAddItem(newItem);
      setItemName("");
      setItemCost("");
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddItem();
    }
  };

  const handleVatSwitch = (e) => {
    setVatEnabled(e.target.checked);
    if (e.target.checked && itemCost.trim() && !isNaN(parseFloat(itemCost))) {
      const cost = parseFloat(itemCost);
      const Tax = cost + (cost * 0.14);
      setItemCost(Tax.toFixed(2));
    }
  };

  return (
    <>
      <div className="card">
        <div className="section-header">
          <Plus className="icon-blue" size={24} />
          <h2>Add Budget Items</h2>
        </div>
        <div className="input-group">
          <div className="input-flex">
            <input
              type="text"
              placeholder="Item's name..."
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input"
            />
          </div>
          <div className="input-fixed">
            <input
              type="number"
              placeholder="Cost..."
              value={itemCost}
              onChange={(e) => setItemCost(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input"
            />
          </div>
          <div className="switch-fixed">
            <span className="alert">VAT. is an additional 14% of your original price.</span>
            <Switch
              checked={vatEnabled}
              onChange={handleVatSwitch}
            />
            <span>VAT</span>
          </div>
          <button onClick={handleAddItem} className="btn-primary">
            <Plus size={20} />
            Add
          </button>
        </div>
      </div>

      {/* Items List Section */}
      {items.length > 0 && (
        <div className="card">
          <div className="section-header">
            <Trash2 className="icon-green" size={24} />
            <h2>Budget Items ({items.length})</h2>
          </div>
          
          <div className="items-list">
            {items.map((item) => (
              <div key={item.id} className="item">
                <div className="item-name">{item.name}</div>
                <div className="item-actions">
                  <span className="item-cost">${item.cost.toFixed(2)}</span>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="btn-danger"
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}