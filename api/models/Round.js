const mongoose = require("mongoose");

// Timeslot Schema
const TimeslotSchema = new mongoose.Schema({
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: "Startup", required: true }, // Startup being judged
  judges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Judge", required: true }], // Judges assigned to this timeslot
  startTime: { type: Date, required: true }, // Start time of the timeslot
  endTime: { type: Date, required: true }, // End time of the timeslot
  room: { type: String, required: true }, // Room or Zoom link
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending", // Default status
  },
  createdAt: { type: Date, default: Date.now }, // Creation timestamp
});

// Session Schema
const SessionSchema = new mongoose.Schema({
  judges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Judge", required: true }], // Judges assigned to this session
  startups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Startup", required: true }], // Startups assigned to this session
  timeslots: [TimeslotSchema], // Array of timeslots for this session
  createdAt: { type: Date, default: Date.now }, // Creation timestamp
});

// Schedule Schema
const ScheduleSchema = new mongoose.Schema({
  date: { type: Date, required: true }, // Date of the schedule
  sessions: [SessionSchema], // Array of sessions for this schedule
  createdAt: { type: Date, default: Date.now }, // Creation timestamp
});

// Round Schema
const RoundSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the round
  criteria: [
    {
      name: { type: String, required: true }, // Criterion name
      weight: { type: Number, required: true, min: 0, max: 100 }, // Weightage of the criterion in percentage
      subquestions: {
        questions: [{ type: String, required: true }], // Subquestion text
        optional: { type: Boolean, default: false }, // Whether the subquestions are optional
      },
    },
  ],
  schedule: [ScheduleSchema], // Array of schedules for the round
  createdAt: { type: Date, default: Date.now }, // Creation timestamp
  updatedAt: { type: Date }, // Update timestamp
});

module.exports = mongoose.model("Round", RoundSchema);




  // results: [{ type: mongoose.Schema.Types.ObjectId, ref: "Results" }], // Results of the round
   // settings: {
  //   enableNotifications: { type: Boolean, default: false },
  // },
 //const RoundSchema = new mongoose.Schema({
 
    //   name: { type: String, required: true },
    //   , // Criteria used in the round
    //   schedule: [{
    //     roundId: { type: mongoose.Schema.Types.ObjectId, ref: "Round", required: true }, // Link to the round
    //     date: { type: Date, required: true }, // Date of the session
    //     startTime: { type: Date, required: true }, // Slot start time
    //     endTime: { type: Date, required: true }, // Slot end time
    //     sessionDuration: { type: Number, required: true }, // Duration of each session in minutes
    //     sessions : [{
    //       roundId: { type: mongoose.Schema.Types.ObjectId, ref: "Round", required: true }, //Which round the session is into
    //       scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Schedule", required: true }, //Which schedule the session is into
    //       startTime: { type: String, required: true },
    //       endTime: { type: String, required: true },
    //       judges: [{
    //         isActive: { type: Boolean, default: false }, // Indicates if judge is currently judging a startup
    //         name: { type: String, required: true },
    //         email: { type: String, required: true, unique: true },
    //         expertise: { type: [String], required: true },
    //         // startupLoad: { type: Number, default: 0 },  Should be dynamiv and come from the timeslots(Since its where the startup is assigned)
    //         // assignedStartups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Startup" }],
    //         timeslots: [{
    //           scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Schedule", required: true },
    //           sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
    //           startupId: { type: mongoose.Schema.Types.ObjectId, ref: "Startup", required: true }, //assigned startup
    //           startTime: { type: String, required: true },
    //           endTime: { type: String, required: true },
    //           status: {
    //             type: String,
    //             enum: ["Pending", "In Progress", "Completed"],
    //             default: "Pending",
    //           },
    //           room: { type: String, required: true }, // Assigned room
    //           remoteRoom: { type: String }, // Optional remote room
    //           createdAt: { type: Date, default: Date.now },
    //         }], // Timeslots assigned to the judge. Can help also finding the startup load
    //         createdAt: { type: Date, default: Date.now },
    //         role: { type: String, default: "judge" },
    //         password: { type: String, required: true }, // For login
    //       }], // Assigned judges
    //       timeslots: [{
    //         scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Schedule", required: true },
    //         sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
    //         startupId: { type: mongoose.Schema.Types.ObjectId, ref: "Startup", required: true }, //assigned startup
    //         startTime: { type: String, required: true },
    //         endTime: { type: String, required: true },
    //         status: {
    //           type: String,
    //           enum: ["Pending", "In Progress", "Completed"],
    //           default: "Pending",
    //         },
    //         room: { type: String, required: true }, // Assigned room
    //         remoteRoom: { type: String }, // Optional remote room
    //         createdAt: { type: Date, default: Date.now },
    //       }], // Associated timeslots
    //       slotDuration: { type: Number, required: true }, // Duration of each slot in minutes
    //       createdAt: { type: Date, default: Date.now },
    //     }], // Associated sessions
    //     createdAt: { type: Date, default: Date.now },
    //     updatedAt: { type: Date },
    //   }], // Schedule of the round, coz they canbe in several days
    
    //   createdAt: { type: Date, default: Date.now },
    //   updatedAt: { type: Date },
    // });
    // const JudgeSchema = new mongoose.Schema({
    //   name: { type: String, required: true },
    //   email: { type: String, required: true, unique: true, sparse: true },
    //   expertise: [String],
    //   createdAt: { type: Date, default: Date.now },
    // });