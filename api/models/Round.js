const mongoose = require("mongoose");

// Timeslot Schema (nested within Session Schema)
const TimeslotSchema = new mongoose.Schema({
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: "Startup", required: true },
  judges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Judge", required: true }],
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  room: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

// Session Schema
const SessionSchema = new mongoose.Schema({
  timeslots: [TimeslotSchema], // Array of timeslots for this session
});

// Schedule Schema
const ScheduleSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  sessions: [SessionSchema], // Array of sessions for this schedule
});

// Round Schema
const RoundSchema = new mongoose.Schema({
  name: { type: String, required: true },
  criteria: [
    {
      name: { type: String, required: true },
      weight: { type: Number, required: true, min: 0, max: 100 },
      subquestions: {
        questions: [{ type: String, required: true }],
        optional: { type: Boolean, default: false },
      },
    },
  ],
  schedule: [ScheduleSchema], // Array of schedules for this round
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
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