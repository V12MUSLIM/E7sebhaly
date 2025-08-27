import { Download } from "lucide-react";

const ReportDownloader = ({ totalBudget, items, totalSpent, remaining }) => {
  const generatePDFContent = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Budget Report</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              max-width: 900px;
              margin: 0 auto;
              padding: 20px;
              color: #333;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 3px solid #3b82f6;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #1f2937;
              margin: 0 0 10px 0;
            }
            .header p {
              color: #6b7280;
              margin: 0;
            }
            .summary {
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              padding: 25px;
              border-radius: 10px;
              margin-bottom: 30px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .summary h2 {
              margin-top: 0;
              color: #374151;
            }
            .summary-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 15px;
              padding: 10px;
              background: white;
              border-radius: 6px;
              font-size: 16px;
            }
            .summary-item:last-child {
              margin-bottom: 0;
            }
            .remaining {
              font-weight: bold;
              color: ${remaining >= 0 ? "#10b981" : "#ef4444"};
              background-color: ${remaining >= 0 ? "#d1fae5" : "#fee2e2"} !important;
            }
            .items-section {
              margin-top: 30px;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              border-radius: 8px;
              overflow: hidden;
            }
            .items-table th {
              background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
              color: white;
              padding: 15px;
              text-align: left;
              font-weight: 600;
            }
            .items-table td {
              padding: 12px 15px;
              border-bottom: 1px solid #e5e7eb;
            }
            .items-table tr:nth-child(even) {
              background-color: #f9fafb;
            }
            .items-table tr:hover {
              background-color: #f3f4f6;
            }
            .cost {
              text-align: right;
              font-weight: 600;
              color: #059669;
            }
            .category {
              color: #6b7280;
              font-style: italic;
            }
            .vat-indicator {
              display: inline-block;
              background: #fbbf24;
              color: #92400e;
              font-size: 11px;
              padding: 2px 6px;
              border-radius: 12px;
              margin-left: 8px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .total-row {
              font-weight: bold;
              background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%) !important;
              border-top: 2px solid #d1d5db;
            }
            .total-row td {
              padding: 15px;
              font-size: 16px;
            }
            .no-items {
              text-align: center;
              color: #6b7280;
              font-style: italic;
              padding: 40px;
              background-color: #f9fafb;
              border-radius: 8px;
              margin-top: 20px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #9ca3af;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
              font-size: 14px;
            }
            .item-name {
              font-weight: 500;
              color: #111827;
              margin-bottom: 4px;
            }
            .category-summary {
              margin-bottom: 30px;
              background: white;
              border-radius: 10px;
              padding: 20px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .category-summary h3 {
              margin-top: 0;
              color: #374151;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 10px;
            }
            .category-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 8px 0;
              border-bottom: 1px solid #f3f4f6;
            }
            .category-item:last-child {
              border-bottom: none;
            }
            @media print {
              body { margin: 0; padding: 15px; }
              .summary { break-inside: avoid; }
              .items-table { break-inside: avoid; }
              .category-summary { break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>💰 Budget Report</h1>
            <p>Generated on ${new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
          
          <div class="summary">
            <h2>📊 Budget Overview</h2>
            <div class="summary-item">
              <span><strong>Total Budget:</strong></span>
              <span>$${parseFloat(totalBudget || 0).toFixed(2)}</span>
            </div>
            <div class="summary-item">
              <span><strong>Total Spent:</strong></span>
              <span>$${totalSpent.toFixed(2)}</span>
            </div>
            <div class="summary-item remaining">
              <span><strong>${remaining >= 0 ? 'Remaining:' : 'Over Budget:'}</strong></span>
              <span>$${Math.abs(remaining).toFixed(2)}</span>
            </div>
          </div>

          ${items.length > 0 ? (() => {
            // Group items by category
            const categoryTotals = items.reduce((acc, item) => {
              const category = item.category || 'Uncategorized';
              if (!acc[category]) {
                acc[category] = { total: 0, count: 0, hasVat: false };
              }
              acc[category].total += item.cost;
              acc[category].count += 1;
              if (item.hasVat) acc[category].hasVat = true;
              return acc;
            }, {});

            return `
              <div class="category-summary">
                <h3>📂 Spending by Category</h3>
                ${Object.entries(categoryTotals).map(([category, data]) => `
                  <div class="category-item">
                    <span><strong>${category}</strong> (${data.count} item${data.count !== 1 ? 's' : ''})</span>
                    <span>$${data.total.toFixed(2)}</span>
                  </div>
                `).join('')}
              </div>
            `;
          })() : ''}

          <div class="items-section">
            <h2>🛍 Budget Items</h2>
            ${items.length > 0 ? `
              <table class="items-table">
                <thead>
                  <tr>
                    <th style="width: 45%">Item Name</th>
                    <th style="width: 25%">Category</th>
                    <th style="width: 30%" class="cost">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  ${items.map((item, index) => `
                    <tr>
                      <td>
                        <div class="item-name">${index + 1}. ${item.name}</div>
                      </td>
                      <td class="category">${item.category || 'Uncategorized'}</td>
                      <td class="cost">
                        $${item.cost.toFixed(2)}
                        ${item.hasVat ? '<span class="vat-indicator">VAT</span>' : ''}
                      </td>
                    </tr>
                  `).join('')}
                  <tr class="total-row">
                    <td colspan="2"><strong>Total (${items.length} items)</strong></td>
                    <td class="cost"><strong>$${totalSpent.toFixed(2)}</strong></td>
                  </tr>
                </tbody>
              </table>
            ` : `
              <div class="no-items">
                <p>No budget items have been added yet.</p>
              </div>
            `}
          </div>

          <div class="footer">
            <p>This report was generated by Budget Tracker App</p>
            <p>💡 Tip: Use your browser's print function to save this as a PDF</p>
            ${items.some(item => item.hasVat) ? '<p>⚠ Items marked with VAT include 14% tax</p>' : ''}
          </div>
        </body>
      </html>
    `;
  };

  const handleDownload = () => {
    const pdfContent = generatePDFContent();
    const blob = new Blob([pdfContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `budget-report-${new Date().toISOString().split("T")[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Only show download button if there's budget data or items
  if (!totalBudget && items.length === 0) {
    return null;
  }

  return (
    <div className="download-section">
      <button onClick={handleDownload} className="btn-download">
        <Download size={20} />
        Download Budget Report
      </button>
      <p className="download-note">
        📄 Downloads as HTML file - use your browser's print function to save as PDF
      </p>
    </div>
  );
};

export default ReportDownloader;