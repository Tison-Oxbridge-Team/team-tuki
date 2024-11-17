import React from "react";
import "./schedule.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Schedule = () => {
  const [date, setDate] = React.useState(new Date());
  return (
    <div className="large-card">
      <div className="inner-card-container">
        <div className="pink-card">
          <h3>CALENDAR VIEW</h3>
          <Calendar
            onChange={setDate} // Update state on date selection
            value={date} // Bind selected date to state
          />
          <p className="selected-date">Selected Date: {date.toDateString()}</p>
        </div>
        <div className="pink-card">
          <h4>TIME SLOTS</h4>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
