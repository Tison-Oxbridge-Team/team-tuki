import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import "./judges.css";

function Judges({
  showModal,
  setShowModal,
  judgeRows,
  setJudgeRows,
  newJudgeRow,
  handleJudgeInputChange,
  handleAddJudgeRow,
  handleDeleteJudgeRow,
  handleEditJudgeRow,
}) {
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
  handleAddJudgeRow: PropTypes.func.isRequired,
  handleDeleteJudgeRow: PropTypes.func.isRequired,
  handleEditJudgeRow: PropTypes.func.isRequired,
};

export default Judges;
