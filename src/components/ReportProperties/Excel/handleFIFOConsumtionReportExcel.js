import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const handleFIFOConsumtionReportExcel = (data, companyinfo, reportTitle) => {
  const fileName = reportTitle.toLowerCase().replace(/\s+/g, '');
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Report');

  // Header setup (company and report title)
  const totalColumns = 1 + 4 * 3; // Date + 4 sections × (Quantity, Rate, Amount)

  worksheet.mergeCells(1, 1, 1, totalColumns);
  worksheet.getCell('A1').value = companyinfo[0].companyName;
  worksheet.getCell('A1').font = { size: 14, bold: true };
  worksheet.getCell('A1').alignment = { horizontal: 'center' };

  worksheet.mergeCells(2, 1, 2, totalColumns);
  worksheet.getCell('A2').value = companyinfo[0].companyAddress;
  worksheet.getCell('A2').font = { size: 12, bold: true };
  worksheet.getCell('A2').alignment = { horizontal: 'center' };

  worksheet.mergeCells(3, 1, 3, totalColumns);
  worksheet.getCell('A3').value = reportTitle;
  worksheet.getCell('A3').font = { size: 12, bold: true };
  worksheet.getCell('A3').alignment = { horizontal: 'center' };

  // Main Headers Row (Row 4)
  worksheet.mergeCells('A4:A5');
  worksheet.getCell('A4').value = 'Date';
  worksheet.getCell('A4').alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell('A4').font = { bold: true };

  const sections = ['Opening Balance', 'Purchase', 'Issue', 'Closing'];
  const subHeaders = ['Quantity', 'Rate', 'Amount'];

  let col = 2; // Starting column index for section headers (after Date)
  sections.forEach((section) => {
    worksheet.mergeCells(4, col, 4, col + 2); // Merge 3 columns
    worksheet.getCell(4, col).value = section;
    worksheet.getCell(4, col).alignment = { horizontal: 'center' };
    worksheet.getCell(4, col).font = { bold: true };

    subHeaders.forEach((sub, idx) => {
      worksheet.getCell(5, col + idx).value = sub;
      worksheet.getCell(5, col + idx).alignment = { horizontal: 'center' };
      worksheet.getCell(5, col + idx).font = { bold: true };
    });

    col += 3;
  });

  // Add row data
  data.forEach((row, rowIndex) => {
    const excelRow = [
      row.date,
      row.opening.quantity || '--',
      row.opening.rate || '--',
      row.opening.amount || '--',
      row.purchase.quantity || '--',
      row.purchase.rate || '--',
      row.purchase.amount || '--',
      row.issue.quantity || '--',
      row.issue.rate || '--',
      row.issue.amount || '--',
      row.closing.quantity || '--',
      row.closing.rate || '--',
      row.closing.amount || '--'
    ];
    worksheet.addRow(excelRow);
  });

  // Set alignment and border for all cells
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  });

  // Export
  workbook.xlsx.writeBuffer().then((buffer) => {
    saveAs(new Blob([buffer]), `${fileName}.xlsx`);
  });
};


export default handleFIFOConsumtionReportExcel
