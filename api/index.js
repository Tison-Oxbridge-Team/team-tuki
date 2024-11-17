const express = require('express');
const { setupWebSocketServer } = require('./services/webSocketService.js');
const http = require('http');
const { connectDB } = require('./db.js');// Import routes
const authRoutes = require('./routes/auth.js');
const startupRoutes = require('./routes/startups.js');
const roundRoutes = require('./routes/rounds.js');
const scoreRoutes = require('./routes/scores.js');
const cors = require('cors');

const app = express();

app.use(express.json());

app.use(cors());

//db
connectDB()




app.use('/api/auth', authRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/rounds', roundRoutes);
app.use('/api/scores', scoreRoutes);



const server = http.createServer(app);
setupWebSocketServer(server);
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
