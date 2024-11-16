  function formatDataForExport(rawData) {
      // Format raw MongoDB data for export
      return rawData.map(item => ({
          Startup: item.startupName,
          Round: item.roundName,
          JudgeCount: item.judgeCount,
          AverageScore: item.averageScore.toFixed(2),
          Nominations: item.nominations,
      }));
  }

  function formatDataForPDF(rawData) {
      // Format data specifically for PDF export
      return rawData.map(item => ({
          ...formatDataForExport([item])[0],
          AverageScore: `${item.averageScore.toFixed(2)}%`,
          Nominations: `${item.nominations} votes`
      }));
  }

  function formatDataForGoogleSheets(rawData) {
      // Format data specifically for Google Sheets
      return rawData.map(item => ({
          ...formatDataForExport([item])[0],
          LastUpdated: new Date().toISOString()
      }));
  }

  module.exports = {
      formatDataForExport,
      formatDataForPDF,
      formatDataForGoogleSheets
  };
