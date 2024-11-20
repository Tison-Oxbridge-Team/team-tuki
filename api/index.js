const express = require('express');
const { setupWebSocketServer } = require('./services/webSocketService.js');
const http = require('http');
const { connectDB } = require('./db.js');// Import routes
const authRoutes = require('./routes/adminAuth.js');
const startupRoutes = require('./routes/startups.js');
const roundRoutes = require('./routes/rounds.js');
const judgeRoutes = require('./routes/judges.js')
const schedulesRoutes = require("./routes/schedule.js")
const criteriaRoutes = require("./routes/criteria.js")
const sessionRoutes = require("./routes/session.js")

const timeslotRoutes = require("./routes/timeSlot.js")


const cors = require('cors');

const app = express();

app.use(express.json());

app.use(cors());

//db
connectDB()




// app.use('/api/auth', authRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/rounds', roundRoutes);
app.use('/api/judges', judgeRoutes);
// app.use('/api/schedules', schedulesRoutes);
app.use('/api/admin-auth', authRoutes);
// app.use('/api/criteria', criteriaRoutes);
// app.use('/api/session', sessionRoutes);
//app.use('/api/timeslot', timeslotRoutes);




const server = http.createServer(app);
setupWebSocketServer(server);
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
