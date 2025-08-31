import { Download, FileSpreadsheet } from "lucide-react";
import * as XLSX from 'xlsx';
import { useState } from 'react';

const ExcelExporter = ({ totalBudget, items, totalSpent, remaining }) => {
  const [isExporting, setIsExporting] = useState(false);

  const generateExcelFile = () => {
    const workbook = XLSX.utils.book_new();

    // Summary Sheet
    const summaryData = [
      ['E7sebhaly Budget Report', '', ''],
      ['Generated on:', new Date().toLocaleString(), ''],
      ['', '', ''],
      ['Budget Overview', '', ''],
      ['Total Budget', parseFloat(totalBudget || 0).toFixed(2), 'USD'],
      ['Total Spent', totalSpent.toFixed(2), 'USD'],
      ['Remaining', remaining.toFixed(2), 'USD'],
      ['Status', remaining >= 0 ? 'Within Budget' : 'Over Budget', ''],
      ['Budget Utilization', `${totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0}%`, ''],
      ['Total Items', items.length, ''],
      ['', '', ''],
      ['VAT Summary', '', ''],
      ['Items with VAT', items.filter(item => item.hasVat).length, ''],
      ['Items without VAT', items.filter(item => !item.hasVat).length, '']
    ];

    const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
    summaryWorksheet['!cols'] = [{ width: 20 }, { width: 15 }, { width: 10 }];
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');

    // Items Sheet
    if (items.length > 0) {
      const itemsData = [
        ['#', 'Item Name', 'Category', 'Cost (USD)', 'VAT Applied', 'Base Price', 'Date Added']
      ];

      items.forEach((item, index) => {
        const basePrice = item.hasVat ? (item.cost / 1.14).toFixed(2) : item.cost.toFixed(2);
        itemsData.push([
          index + 1,
          item.name,
          item.category || 'Uncategorized',
          parseFloat(item.cost).toFixed(2),
          item.hasVat ? 'Yes (14%)' : 'No',
          item.hasVat ? basePrice : 'Same as cost',
          new Date(item.id).toLocaleDateString()
        ]);
      });

      // Add summary row
      itemsData.push([
        '',
        'TOTAL',
        `${items.length} items`,
        totalSpent.toFixed(2),
        `${items.filter(item => item.hasVat).length} with VAT`,
        '',
        ''
      ]);

      const itemsWorksheet = XLSX.utils.aoa_to_sheet(itemsData);
      itemsWorksheet['!cols'] = [
        { width: 5 },   // #
        { width: 25 },  // Item Name
        { width: 18 },  // Category
        { width: 12 },  // Cost
        { width: 12 },  // VAT Applied
        { width: 15 },  // Base Price
        { width: 12 }   // Date Added
      ];
      
      XLSX.utils.book_append_sheet(workbook, itemsWorksheet, 'Items Detail');

      // Category Analysis Sheet
      const categoryTotals = items.reduce((acc, item) => {
        const category = item.category || 'Uncategorized';
        if (!acc[category]) {
          acc[category] = { total: 0, count: 0, withVat: 0, withoutVat: 0 };
        }
        acc[category].total += item.cost;
        acc[category].count += 1;
        if (item.hasVat) {
          acc[category].withVat += 1;
        } else {
          acc[category].withoutVat += 1;
        }
        return acc;
      }, {});

      const categoryData = [
        ['Category Analysis', '', '', '', '', ''],
        ['Category', 'Total Cost', 'Items Count', 'Average Cost', 'With VAT', 'Without VAT']
      ];

      Object.entries(categoryTotals)
        .sort(([,a], [,b]) => b.total - a.total) // Sort by total cost descending
        .forEach(([category, data]) => {
          categoryData.push([
            category,
            data.total.toFixed(2),
            data.count,
            (data.total / data.count).toFixed(2),
            data.withVat,
            data.withoutVat
          ]);
        });

      // Add totals
      const totalItems = Object.values(categoryTotals).reduce((sum, cat) => sum + cat.count, 0);
      const totalVatItems = Object.values(categoryTotals).reduce((sum, cat) => sum + cat.withVat, 0);
      const totalNonVatItems = Object.values(categoryTotals).reduce((sum, cat) => sum + cat.withoutVat, 0);
      
      categoryData.push([
        'TOTAL',
        totalSpent.toFixed(2),
        totalItems,
        totalItems > 0 ? (totalSpent / totalItems).toFixed(2) : '0.00',
        totalVatItems,
        totalNonVatItems
      ]);

      const categoryWorksheet = XLSX.utils.aoa_to_sheet(categoryData);
      categoryWorksheet['!cols'] = [
        { width: 20 }, { width: 12 }, { width: 12 }, 
        { width: 15 }, { width: 10 }, { width: 12 }
      ];
      
      XLSX.utils.book_append_sheet(workbook, categoryWorksheet, 'Category Analysis');
    }

    return workbook;
  };

  const exportToExcel = async () => {
    setIsExporting(true);
    try {
      const workbook = generateExcelFile();
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `E7sebhaly-Budget-${timestamp}.xlsx`;
      
      XLSX.writeFile(workbook, filename);
      
      // Show success message
      const message = `Excel file "${filename}" downloaded successfully!`;
      if (window.confirm(`${message}\n\nWould you like to export again with a different name?`)) {
        // User can export again if needed
        return;
      }
    } catch (error) {
      console.error('Excel export error:', error);
      alert('Failed to generate Excel file. Please try again or use CSV export as alternative.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToCSV = async () => {
    setIsExporting(true);
    try {
      // Generate CSV data manually for better control
      let csvContent = '';
      
      // Summary section
      csvContent += 'E7sebhaly Budget Report\n';
      csvContent += `Generated on,${new Date().toLocaleString()}\n\n`;
      csvContent += 'Budget Overview\n';
      csvContent += `Total Budget,${parseFloat(totalBudget || 0).toFixed(2)}\n`;
      csvContent += `Total Spent,${totalSpent.toFixed(2)}\n`;
      csvContent += `Remaining,${remaining.toFixed(2)}\n`;
      csvContent += `Status,${remaining >= 0 ? 'Within Budget' : 'Over Budget'}\n`;
      csvContent += `Budget Utilization,${totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0}%\n`;
      csvContent += `Total Items,${items.length}\n\n`;
      
      // Items section
      if (items.length > 0) {
        csvContent += 'Items Detail\n';
        csvContent += '#,Item Name,Category,Cost,VAT Applied,Base Price,Date Added\n';
        
        items.forEach((item, index) => {
          const basePrice = item.hasVat ? (item.cost / 1.14).toFixed(2) : item.cost.toFixed(2);
          const itemName = `"${item.name.replace(/"/g, '""')}"`;
          const category = `"${(item.category || 'Uncategorized').replace(/"/g, '""')}"`;
          
          csvContent += `${index + 1},${itemName},${category},${item.cost.toFixed(2)},${item.hasVat ? 'Yes (14%)' : 'No'},${item.hasVat ? basePrice : 'Same as cost'},${new Date(item.id).toLocaleDateString()}\n`;
        });
      }
      
      // Download CSV
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().split('T')[0];
      
      link.href = url;
      link.download = `E7sebhaly-Budget-${timestamp}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('CSV export error:', error);
      alert('Failed to generate CSV file. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Don't render if no data
  if (!totalBudget && items.length === 0) {
    return null;
  }

  return (
    <div className="card">
      <div className="section-header">
        <FileSpreadsheet className="icon-purple" size={24} />
        <h2>Export Data</h2>
      </div>
      
      <div className="export-buttons" style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        <button 
          onClick={exportToExcel}
          className="btn-primary"
          style={{
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            flex: '1',
            minWidth: '200px',
            cursor: isExporting ? 'not-allowed' : 'pointer',
            opacity: isExporting ? 0.7 : 1,
          }}
          disabled={isExporting}
        >
          <FileSpreadsheet size={20} />
          Export to Excel (.xlsx)
        </button>
        
        <button 
          onClick={exportToCSV}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '1rem 2rem',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '1rem',
            cursor: isExporting ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            flex: '1',
            minWidth: '200px',
            opacity: isExporting ? 0.7 : 1,
          }}
          disabled={isExporting}
        >
          <Download size={20} />
          Export to CSV
        </button>
      </div>

      <div style={{
        background: 'rgba(139, 92, 246, 0.1)',
        padding: '1rem',
        borderRadius: '0.75rem',
        fontSize: '0.875rem',
        color: '#6b7280'
      }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#8b5cf6', fontSize: '0.9rem' }}>
          Export Features:
        </h4>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '0.25rem' 
        }}>
          <span>• Budget summary & analysis</span>
          <span>• Complete items list</span>
          <span>• Category breakdowns</span>
          <span>• VAT calculations</span>
          <span>• Multiple sheets (Excel only)</span>
          <span>• Professional formatting</span>
        </div>
      </div>
    </div>
  );
};

export default ExcelExporter;