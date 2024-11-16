const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs'); // For Excel export
const PDFDocument = require('pdfkit'); // For PDF export
const { google } = require('googleapis'); // For Google Sheets integration
const { formatDataForExport } = require('../util/dataFormatter'); // Helper for formatting data

async function exportToExcel(data, fileName = 'export.xlsx') {
    try {
        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Exported Data');

        // Add column headers dynamically
        const headers = Object.keys(data[0]);
        worksheet.columns = headers.map(header => ({ header, key: header, width: 20 }));

        // Add rows
        data.forEach(item => worksheet.addRow(item));

        // Save to file
        const filePath = path.join(__dirname, '../exports', fileName);
        await workbook.xlsx.writeFile(filePath);

        return filePath;
    } catch (err) {
        console.error('Error exporting to Excel:', err);
        throw new Error('Failed to export to Excel.');
    }
}

async function exportToPDF(data, fileName = 'export.pdf') {
    try {
        // Create a new PDF document
        const doc = new PDFDocument();

        const filePath = path.join(__dirname, '../exports', fileName);
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        // Add title and table headers
        doc.fontSize(18).text('Exported Data', { align: 'center' }).moveDown();
        const headers = Object.keys(data[0]);
        headers.forEach(header => doc.text(header, { continued: true }).text(' | ', { continued: true }));
        doc.text('').moveDown();

        // Add rows
        data.forEach(item => {
            headers.forEach(header => doc.text(item[header], { continued: true }).text(' | ', { continued: true }));
            doc.text('').moveDown();
        });

        // Finalize the document
        doc.end();

        return new Promise((resolve, reject) => {
            writeStream.on('finish', () => resolve(filePath));
            writeStream.on('error', err => reject(err));
        });
    } catch (err) {
        console.error('Error exporting to PDF:', err);
        throw new Error('Failed to export to PDF.');
    }
}
async function exportToGoogleSheets(data, spreadsheetId, sheetName = 'Exported Data') {
    try {
        const credentials = require('../credentials.json');
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // Format data for Google Sheets
        const headers = Object.keys(data[0]);
        const rows = data.map(item => headers.map(header => item[header]));

        // Write data to Google Sheets
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${sheetName}!A1`,
            valueInputOption: 'RAW',
            requestBody: {
                values: [headers, ...rows],
            },
        });

        return `Data successfully exported to sheet: ${sheetName}`;
    } catch (err) {
        console.error('Error exporting to Google Sheets:', err);
        throw new Error('Failed to export to Google Sheets.');
    }
}

function formatDataForExport(rawData) {
    // Example: Format raw MongoDB data for export
    return rawData.map(item => ({
        Startup: item.startupName,
        Round: item.roundName,
        JudgeCount: item.judgeCount,
        AverageScore: item.averageScore.toFixed(2),
        Nominations: item.nominations,
    }));
}

module.exports = { formatDataForExport };
