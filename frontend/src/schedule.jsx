import { useState } from "react";
import PropTypes from "prop-types";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "./schedule.css";

const Schedule = ({ showModal, setShowModal }) => {
  // Accept props from parent
  const [date] = useState(new Date());
  const [scheduleData, setScheduleData] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    teamName: "",
    judge: "",
    room: "",
    time: "",
    selectedDate: date,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (newDate) => {
    setNewSchedule((prevState) => ({
      ...prevState,
      selectedDate: newDate,
    }));
  };

  const handleAddSchedule = () => {
    setScheduleData((prevData) => [...prevData, newSchedule]);
    setNewSchedule({
      teamName: "",
      judge: "",
      room: "",
      time: "",
      selectedDate: date,
    });
    setShowModal(false); // Close modal after adding schedule
  };

  return (
    <div className="large-card">
      <div className="inner-card-container">
        <div className="pink-card">
          <h3>CALENDAR VIEW</h3>
          <Calendar
            onChange={handleDateChange}
            value={newSchedule.selectedDate}
          />
          <p className="selected-date">
            Selected Date: {newSchedule.selectedDate.toDateString()}
          </p>
        </div>
        <div className="pink-card">
          <h4>TIME SLOTS</h4>
          <div className="time-slot-container">
            {scheduleData.map((slot, index) => (
              <div key={index} className="time-slot-card">
                <p>TIME: {slot.time}</p>
                <p>TEAM NAME: {slot.teamName}</p>
                <p>JUDGE: {slot.judge}</p>
                <p>ROOM: {slot.room}</p>
                <p>DATE: {slot.selectedDate.toDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Modal for Add Schedule Form */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setShowModal(false)}>
              <FontAwesomeIcon icon={faXmark} />
            </span>
            <h2 className="form-title">Add Schedule</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-field">
                <label>
                  Team Name:
                  <input
                    type="text"
                    name="teamName"
                    value={newSchedule.teamName}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>
              <div className="form-field">
                <label>
                  Judge:
                  <input
                    type="text"
                    name="judge"
                    value={newSchedule.judge}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>
              <div className="form-field">
                <label>
                  Room:
                  <input
                    type="text"
                    name="room"
                    value={newSchedule.room}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>
              <div className="form-field">
                <label>
                  Time:
                  <input
                    type="time"
                    name="time"
                    value={newSchedule.time}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>
              <div className="form-field">
                <label>
                  Date:
                  <Calendar
                    onChange={handleDateChange}
                    value={newSchedule.selectedDate}
                    className="date-picker"
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={handleAddSchedule}
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
};

Schedule.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
};

export default Schedule;
