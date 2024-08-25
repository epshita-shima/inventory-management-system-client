import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const handleDownload = (data, companyinfo,reportTitle) => {
    const fileName=reportTitle.toLowerCase().replace(/\s+/g,'');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Supplierlist Report');
console.log(companyinfo)
    // Merge and center header information
    const headerLength = data.length > 0 ? Object.keys(data[0]).length : 0;

    worksheet.mergeCells(`A1:${String.fromCharCode(65 + headerLength - 1)}1`);
    worksheet.getCell('A1').value = `${companyinfo[0].companyName}`;
    worksheet.getCell('A1').font = {
        family: 2,
        size: 14,
        bold: true
    };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };
    worksheet.getCell('A1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

    worksheet.mergeCells(`A2:${String.fromCharCode(65 + headerLength - 1)}2`);
    worksheet.getCell('A2').value = `${companyinfo[0].companyAddress}`;
    worksheet.getCell('A2').alignment = { horizontal: 'center' };
    worksheet.getCell('A2').font = {
        family: 2,
        size: 12,
        bold: true
    };
    worksheet.getCell('A2').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

    worksheet.mergeCells(`A3:${String.fromCharCode(65 + headerLength - 1)}3`);
    worksheet.getCell('A3').value = `${reportTitle}`;
    worksheet.getCell('A3').alignment = { horizontal: 'center' };
    worksheet.getCell('A3').font = {
        family: 2,
        size: 12,
        bold: true
    };
    worksheet.getCell('A3').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

    // Add a blank row for spacing
    // worksheet.addRow([]s

    // Add headers for JSON data
    const headerRow = worksheet.addRow(Object.keys(data[0]));
    headerRow.eachCell((cell) => {
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        cell.alignment = { horizontal: 'center' };
        cell.font = { bold: true };
    });

    // Add data from JSON
    data?.forEach((item) => {
        const values = Object.values(item);
        const row = worksheet.addRow(values);
        row.eachCell((cell) => {
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            cell.alignment = { horizontal: 'center' };
        });
    });

    // Generate buffer
    workbook.xlsx.writeBuffer().then((buffer) => {
        // Save the Excel file
        saveAs(new Blob([buffer]), `${fileName}.xlsx`);
    });
}

export default handleDownload;