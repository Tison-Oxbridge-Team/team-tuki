import { useState } from "react";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import "../../css/importjudgesmodal.css";

// Fetching data from Google Sheets
const fetchGoogleSheetsData = async (spreadsheetUrl, accessToken) => {
  try {
    const match = spreadsheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) {
      throw new Error("Invalid Google Sheets URL");
    }
    const spreadsheetId = match[1];

    const response = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A:E`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const { values } = response.data;
    const rows = values.slice(1); // Skip the headers row

    return rows.map((row) => ({
      idNo: row[0] || "",
      name: row[1] || "",
      email: row[2] || "",
      expertise: row[3] || "",
      status: row[4] || "Assigned",
    }));
  } catch (error) {
    console.error("Error fetching spreadsheet:", error);
    throw error;
  }
};

function ImportJudgesModal({
  showImportModal,
  setShowImportModal,
  judgeRows,
  setJudgeRows,
}) {
  const [spreadsheetLink, setSpreadsheetLink] = useState("");
  const [importError, setImportError] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  const handleLoginSuccess = (response) => {
    const token = response.accessToken;
    setAuthToken(token);
  };

  const handleLoginFailure = (error) => {
    console.error("Login failed", error);
    setImportError("Failed to log in to Google. Please try again.");
  };

  const handleImport = async () => {
    if (!authToken) {
      setImportError("Please log in to Google.");
      return;
    }

    try {
      if (!spreadsheetLink.includes("docs.google.com/spreadsheets")) {
        setImportError("Please provide a valid Google Sheets URL.");
        return;
      }

      const importedJudges = await fetchGoogleSheetsData(
        spreadsheetLink,
        authToken
      );

      const uniqueImportedJudges = importedJudges.filter(
        (newJudge) =>
          !judgeRows.some(
            (existingJudge) => existingJudge.email === newJudge.email
          )
      );

      setJudgeRows((prevJudges) => [...prevJudges, ...uniqueImportedJudges]);
      setShowImportModal(false);
      setImportError(null);
    } catch (error) {
        console.log(error)
      setImportError("Failed to import judges. Check the URL and try again.");
    }
  };

  return (
    showImportModal && (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <div className="import-modal-overlay">
          <div className="import-modal-content">
            <div className="import-modal-header">
              <span
                className="import-modal-close"
                onClick={() => setShowImportModal(false)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </span>
            </div>

            <h2 className="import-modal-title">ENTER SPREADSHEET LINK</h2>
            <p className="import-modal-description">
              ENTER A LINK WITH JUDGES DETAILS
            </p>

            {importError && (
              <div className="import-error-message" style={{ color: "red" }}>
                {importError}
              </div>
            )}

            <div className="import-modal-form">
              <label htmlFor="spreadsheet-url" className="import-modal-label">
                SPREADSHEET URL
                <input
                  type="url"
                  id="spreadsheet-url"
                  className="import-modal-input"
                  placeholder="Paste Google Spreadsheet link here"
                  value={spreadsheetLink}
                  onChange={(e) => setSpreadsheetLink(e.target.value)}
                  required
                />
              </label>

              <p className="import-modal-warning">CROSS CHECK YOUR INFO</p>

              <button
                className="import-modal-submit-btn"
                onClick={handleImport}
              >
                IMPORT
              </button>

              <GoogleLogin
                clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                buttonText="Login with Google"
                onSuccess={handleLoginSuccess}
                onFailure={handleLoginFailure}
                scope="https://www.googleapis.com/auth/spreadsheets.readonly"
              />
            </div>
          </div>
        </div>
      </GoogleOAuthProvider>
    )
  );
}

ImportJudgesModal.propTypes = {
  showImportModal: PropTypes.bool.isRequired,
  setShowImportModal: PropTypes.func.isRequired,
  judgeRows: PropTypes.array.isRequired,
  setJudgeRows: PropTypes.func.isRequired,
};

export default ImportJudgesModal;