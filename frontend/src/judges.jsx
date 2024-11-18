import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import "./judges.css";
import { useEffect } from "react";

function Judges({
  showModal,
  setShowModal,
  judgeRows,
  setJudgeRows,
  newJudgeRow,
  setNewJudgeRow,
  handleJudgeInputChange,
}) {
  // Set base URL for Axios
  const axiosInstance = axios.create({
    baseURL: "http://localhost:5001/api",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass token for authentication
    },
  });

  // Fetch judges from the backend
  const fetchJudges = async () => {
    try {
      const response = await axiosInstance.get("/judges");
      setJudgeRows(response.data.judges); // Assume API returns { judges: [...] }
    } catch (error) {
      console.error("Error fetching judges:", error.response?.data || error.message);
    }
  };

  // Add a new judge
  const handleAddJudgeRow = async () => {
    try {
      const response = await axiosInstance.post("/judges", newJudgeRow);
      setJudgeRows((prevRows) => [...prevRows, response.data]); // Add new judge to the list
      setShowModal(false);
      setNewJudgeRow({ idNo: "", name: "", email: "", status: "Assigned" }); // Reset form
    } catch (error) {
      console.error("Error adding judge:", error.response?.data || error.message);
    }
  };

  // Delete a judge
  const handleDeleteJudgeRow = async (index) => {
    const judgeToDelete = judgeRows[index];
    try {
      await axiosInstance.delete(`/judges/${judgeToDelete._id}`);
      setJudgeRows(judgeRows.filter((_, i) => i !== index)); // Remove from UI
    } catch (error) {
      console.error("Error deleting judge:", error.response?.data || error.message);
    }
  };

  // Edit a judge
  const handleEditJudgeRow = (index) => {
    setNewJudgeRow(judgeRows[index]); // Load judge into modal
    setJudgeRows(judgeRows.filter((_, i) => i !== index)); // Temporarily remove from list
    setShowModal(true);
  };

  // Fetch judges on component mount
  useEffect(() => {
    fetchJudges();
  }, []);

  return (
    <div>
      {/* Table */}
      <div className="table-wrapper">
        <table className="judge-table">
          <thead>
            <tr>
              <th>ID NO</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {judgeRows.map((row, index) => (
              <tr key={index}>
                <td>{row.idNo}</td>
                <td>{row.name}</td>
                <td>{row.email}</td>
                <td>
                  <select
                    value={row.status}
                    onChange={(e) => {
                      const updatedRows = [...judgeRows];
                      updatedRows[index].status = e.target.value;
                      setJudgeRows(updatedRows);
                    }}
                  >
                    <option value="Assigned">Assigned</option>
                    <option value="Unassigned">Unassigned</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </td>
                <td>
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    className="icon"
                    cursor="pointer"
                    onClick={() => handleEditJudgeRow(index)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="icon"
                    cursor="pointer"
                    onClick={() => handleDeleteJudgeRow(index)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setShowModal(false)}>
              <FontAwesomeIcon icon={faXmark} />
            </span>
            <h2 className="form-title">
              {newJudgeRow.name ? "Edit Judge" : "Add Judge"}
            </h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-field">
                <label>
                  ID NO:
                  <input
                    type="text"
                    name="idNo"
                    value={newJudgeRow.idNo}
                    onChange={handleJudgeInputChange}
                    required
                  />
                </label>
              </div>
              <div className="form-field">
                <label>
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={newJudgeRow.name}
                    onChange={handleJudgeInputChange}
                    required
                  />
                </label>
              </div>
              <div className="form-field">
                <label>
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={newJudgeRow.email}
                    onChange={handleJudgeInputChange}
                    required
                  />
                </label>
              </div>
              <div className="form-field">
                <label>Status:</label>
                <select
                  name="status"
                  value={newJudgeRow.status}
                  onChange={handleJudgeInputChange}
                  required
                >
                  <option value="Assigned">Assigned</option>
                  <option value="Unassigned">Unassigned</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
              <button
                type="button"
                onClick={handleAddJudgeRow}
                className="submit-button"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
Judges.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  judgeRows: PropTypes.array.isRequired,
  setJudgeRows: PropTypes.func.isRequired,
  newJudgeRow: PropTypes.object.isRequired,
  setNewJudgeRow: PropTypes.func.isRequired,
  handleJudgeInputChange: PropTypes.func.isRequired,
};

export default Judges;
