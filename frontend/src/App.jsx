import { useState } from "react";
import Judges from "./judges";
import Schedule from "./schedule";
import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faUserGroup,
  faMedal,
  faCalendarDays,
  faGear,
  faMagnifyingGlass,
  faPlus,
  faDownload,
  faUpload,
  faTrash,
  faXmark,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

function App() {
  const [activeTab, setActiveTab] = useState("startups");
  const [showModal, setShowModal] = useState(false);

  // Startup states
  const [rows, setRows] = useState([]);
  const [newRow, setNewRow] = useState({
    company: "",
    category: "",
    teamLeader: "",
    email: "",
    pitchSlot: "",
    status: "-----",
  });

  // Judges states
  const [judgeRows, setJudgeRows] = useState([]);
  const [newJudgeRow, setNewJudgeRow] = useState({
    idNo: "",
    name: "",
    email: "",
    status: "Assigned",
  });

  // Handle input changes for the startup modal form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRow((prevRow) => ({
      ...prevRow,
      [name]: value,
    }));
  };

  // Handle input changes for the judges modal form
  const handleJudgeInputChange = (e) => {
    const { name, value } = e.target;
    setNewJudgeRow((prevRow) => ({
      ...prevRow,
      [name]: value,
    }));
  };

  // Add a new startup row or update an existing one
  const handleAddRow = () => {
    setRows((prevRows) => [...prevRows, newRow]);
    setShowModal(false);
    setNewRow({
      company: "",
      category: "",
      teamLeader: "",
      email: "",
      pitchSlot: "",
      status: "In Session",
    });
  };

  // Add a new judge row or update an existing one
  const handleAddJudgeRow = () => {
    setJudgeRows((prevRows) => [...prevRows, newJudgeRow]);
    setShowModal(false);
    setNewJudgeRow({
      idNo: "",
      name: "",
      email: "",
      status: "Assigned",
    });
  };

  // Delete a startup row
  const handleDeleteRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  // Delete a judge row
  const handleDeleteJudgeRow = (index) => {
    setJudgeRows(judgeRows.filter((_, i) => i !== index));
  };

  // Edit an existing startup row
  const handleEditRow = (index) => {
    setNewRow(rows[index]);
    setRows(rows.filter((_, i) => i !== index));
    setShowModal(true);
  };

  // Edit an existing judge row
  const handleEditJudgeRow = (index) => {
    setNewJudgeRow(judgeRows[index]);
    setJudgeRows(judgeRows.filter((_, i) => i !== index));
    setShowModal(true);
  };

  // Search functionality
  const handleSearch = () => {
    const searchValue = document.querySelector(".search-input").value;
    alert(`You searched for: ${searchValue}`);
  };

  const formatTime = (time24) => {
    const [hours, minutes] = time24.split(":");
    const isPM = hours >= 12;
    const adjustedHours = hours % 12 || 12;
    const amPm = isPM ? "PM" : "AM";
    return `${adjustedHours}:${minutes} ${amPm}`;
  };

  return (
    <div>
      {/* Topbar */}
      <div className="topbar">
        <div className="title">Oxbridge AI Challenge</div>
        <div className="round-indicator">Round 2 in progress</div>
        <label className="ui-switch">
          <input type="checkbox" />
          <div className="slider">
            <div className="circle"></div>
          </div>
        </label>
        <FontAwesomeIcon icon={faUser} className="user-icon" cursor="pointer" />
      </div>
      {/* Cards */}
      <div className="card-container">
        <div className="card shadow">
          <div className="card-header">
            <h2>Total Startups</h2>
            <FontAwesomeIcon icon={faUserGroup} className="icon" />
          </div>
          <div className="card-body">
            <div className="number">24</div>
            <p className="description">+2 from last round</p>
          </div>
        </div>
        <div className="card shadow">
          <div className="card-header">
            <h2>Active Judges</h2>
            <FontAwesomeIcon icon={faMedal} className="icon" />
          </div>
          <div className="card-body">
            <div className="number">8</div>
            <p className="description">All assigned</p>
          </div>
        </div>
        <div className="card shadow">
          <div className="card-header">
            <h2>Upcoming Pitches</h2>
            <FontAwesomeIcon icon={faCalendarDays} className="icon" />
          </div>
          <div className="card-body">
            <div className="number">12</div>
            <p className="description">Next 24 hours</p>
          </div>
        </div>
        <div className="card shadow">
          <div className="card-header">
            <h2>Average Score</h2>
            <FontAwesomeIcon icon={faGear} className="icon" />
          </div>
          <div className="card-body">
            <div className="number">7.8</div>
            <p className="description">Out of 10</p>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="tabs-container">
        <div
          className={`tab ${activeTab === "startups" ? "active" : ""}`}
          onClick={() => setActiveTab("startups")}
        >
          Startups
        </div>
        <div
          className={`tab ${activeTab === "judges" ? "active" : ""}`}
          onClick={() => setActiveTab("judges")}
        >
          Judges
        </div>
        <div
          className={`tab ${activeTab === "schedule" ? "active" : ""}`}
          onClick={() => setActiveTab("schedule")}
        >
          Schedule
        </div>
        {/* <div
          className={`tab ${activeTab === "rounds" ? "active" : ""}`}
          onClick={() => setActiveTab("rounds")}
        >
          Rounds
        </div> */}
        <div
          className={`tab ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </div>
      </div>
      {/* Search Bar */}
      {["startups", "judges"].includes(activeTab) && (
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="search-button" onClick={handleSearch}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
      )}
      {/* Buttons */}
      {/* Buttons */}
      {activeTab !== "settings" && (
        <div className="button-container">
          <button
            className="add-startup-button"
            onClick={() => setShowModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
            {activeTab === "judges"
              ? "Add Judge"
              : activeTab === "schedule"
              ? "Add Schedule"
              : "Add Startup"}
          </button>
          <button className="import-button">
            <FontAwesomeIcon icon={faDownload} />
            Import
          </button>
          <button className="export-button">
            <FontAwesomeIcon icon={faUpload} />
            Export
          </button>
        </div>
      )}

      {/* Table */}
      {activeTab === "startups" && (
        <div className="table-wrapper">
          <table className="startup-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Category</th>
                <th>Team Leader</th>
                <th>Email</th>
                <th>Pitch Slot</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td>{row.company}</td>
                  <td>{row.category}</td>
                  <td>{row.teamLeader}</td>
                  <td>{row.email}</td>
                  <td>{formatTime(row.pitchSlot)}</td>
                  <td>{row.status}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className="icon"
                      cursor="pointer"
                      onClick={() => handleEditRow(index)}
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="icon"
                      cursor="pointer"
                      onClick={() => handleDeleteRow(index)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "judges" && (
        <Judges
          showModal={showModal}
          setShowModal={setShowModal}
          judgeRows={judgeRows}
          setJudgeRows={setJudgeRows}
          newJudgeRow={newJudgeRow}
          setNewJudgeRow={setNewJudgeRow}
          handleJudgeInputChange={handleJudgeInputChange}
          handleAddJudgeRow={handleAddJudgeRow}
          handleDeleteJudgeRow={handleDeleteJudgeRow}
          handleEditJudgeRow={handleEditJudgeRow}
        />
      )}
      {activeTab === "schedule" && (
        <Schedule showModal={showModal} setShowModal={setShowModal} />
      )}
      {/* Modal for Startups */}
      {showModal && activeTab === "startups" && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setShowModal(false)}>
              <FontAwesomeIcon icon={faXmark} />
            </span>
            <h2 className="form-title">
              {newRow.company ? "Edit Startup" : "Add Startup"}
            </h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-field">
                <label>
                  Company:
                  <input
                    type="text"
                    name="company"
                    value={newRow.company}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>
              <div className="form-field">
                <label>
                  Category:
                  <input
                    type="text"
                    name="category"
                    value={newRow.category}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>
              <div className="form-field">
                <label>
                  Team Leader:
                  <input
                    type="text"
                    name="teamLeader"
                    value={newRow.teamLeader}
                    onChange={handleInputChange}
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
                    value={newRow.email}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>
              <div className="form-field">
                <label>
                  Pitch Slot:
                  <input
                    type="time"
                    name="pitchSlot"
                    value={newRow.pitchSlot}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>
              <div className="form-field">
                <label>Status:</label>
                <select
                  name="status"
                  value={newRow.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="In Session">In Session</option>
                  <option value="Session Completed">Session Completed</option>
                  <option value="Disqualified">Disqualified</option>
                </select>
              </div>
              <button
                type="button"
                onClick={handleAddRow}
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

export default App;
