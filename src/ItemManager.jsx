import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Switch from '@mui/material/Switch';

export default function ItemManager({ items, onAddItem, onRemoveItem }) {
  const [itemName, setItemName] = useState("");
  const [itemCost, setItemCost] = useState("");
  const [itemCategory, setCategory] = useState("");
  const [vatEnabled, setVatEnabled] = useState(false);
  const [basePrice, setBasePrice] = useState(""); // Store original price

  function handleAddItem() {
    if (itemName.trim() && itemCost.trim() && itemCategory.trim() && !isNaN(parseFloat(itemCost))) {
      const cost = vatEnabled ? parseFloat(basePrice) * 1.14 : parseFloat(itemCost);
      const newItem = {
        id: Date.now(),
        name: itemName.trim(),
        category: itemCategory.trim(),
        cost: cost,
        hasVat: vatEnabled // Store whether VAT was applied
      };
      onAddItem(newItem);
      setItemName("");
      setItemCost("");
      setCategory("");
      setBasePrice("");
      setVatEnabled(false);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddItem();
    }
  };
  
   const handleCostChange = (e) => {
    const value = e.target.value;
    
    if (vatEnabled) {
      // When VAT is enabled, treat input as base price and show VAT-inclusive price
      setBasePrice(value);
      if (value && !isNaN(parseFloat(value))) {
        const cost = parseFloat(value);
        const withVat = cost * 1.14;
        setItemCost(withVat.toFixed(2));
      } else {
        setItemCost(value);
      }
    } else {
      // When VAT is disabled, input value is the actual cost
      setItemCost(value);
      setBasePrice(value);
    }
  };




  const handleVatSwitch = (e) => {
    const isChecked = e.target.checked;
    setVatEnabled(isChecked);
    
    if (basePrice && !isNaN(parseFloat(basePrice))) {
      const cost = parseFloat(basePrice);
      if (isChecked) {
        // Add VAT
        const withVat = cost * 1.14;
        setItemCost(withVat.toFixed(2));
      } else {
        // Remove VAT - revert to base price
        setItemCost(basePrice);
      }
    }
  };

  const [categories, setCategories] = useState([
    "Food", "Electronics", "Bills", "Entertainment", "Other"
  ]);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
      setShowCustomCategory(false);
      setCategory(newCategory.trim());
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
          <div className="input-group">
            <div className="input-flex">
              {!showCustomCategory ? (
                <>
                  <select
                    value={itemCategory}
                    onChange={(e) => {
                      if (e.target.value === "add_new") {
                        setShowCustomCategory(true);
                      } else {
                        setCategory(e.target.value);
                      }
                    }}
                    className="input"
                  >
                    <option value="">Select Category...</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="add_new">+ Add New Category</option>
                  </select>
                </>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="New category..."
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="input"
                  />
                  <button onClick={handleAddCategory} className="btn-primary">Add</button>
                  <button onClick={() => setShowCustomCategory(false)} className="btn-danger">Cancel</button>
                </div>
              )}
            </div>
            <div className="input-fixed">
              <input
                type="number"
                placeholder="Cost..."
                value={itemCost}
                onChange={handleCostChange}
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
                <div className="item-category">{item.category}</div>
                <div className="item-actions">
                  <span className="item-cost">
                    ${item.cost.toFixed(2)}
                    {item.hasVat && <span className="vat-indicator"> (incl. VAT)</span>}
                  </span>
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