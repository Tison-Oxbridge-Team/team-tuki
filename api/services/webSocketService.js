const WebSocket = require('ws');

let clients = {}; // Track connected clients by unique IDs

/**
 * Set up WebSocket server.
 * @param {Object} server - The HTTP server instance.
 */
function setupWebSocketServer(server) {
    const wss = new WebSocket.Server({ server });

    // Handle WebSocket connection
    wss.on('connection', (ws, req) => {
        const clientId = generateUniqueId();
        clients[clientId] = ws;
        console.log(`Client connected: ${clientId}`);

        // Send a welcome message
        ws.send(
            JSON.stringify({ type: 'welcome', message: 'Welcome to the WebSocket server!' })
        );

        // Handle incoming messages
        ws.on('message', (message) => {
            handleIncomingMessage(clientId, message);
        });

        // Handle client disconnection
        ws.on('close', () => {
            console.log(`Client disconnected: ${clientId}`);
            delete clients[clientId];
        });

        // Handle errors
        ws.on('error', (error) => {
            console.error(`Error on client ${clientId}:`, error);
        });
    });

    console.log('WebSocket server is running');
}

/**
 * Handle incoming messages from clients.
 * @param {string} clientId - The ID of the client sending the message.
 * @param {string} message - The incoming message as a string.
 */
function handleIncomingMessage(clientId, message) {
    try {
        const parsedMessage = JSON.parse(message);

        switch (parsedMessage.type) {
            case 'readyForScoring':
                console.log(`Client ${clientId} is ready for scoring`);
                break;

            case 'customEvent':
                console.log(`Custom event received from ${clientId}:`, parsedMessage.data);
                break;

            default:
                console.warn(`Unknown message type from ${clientId}:`, parsedMessage.type);
        }
    } catch (err) {
        console.error(`Failed to handle message from ${clientId}:`, err.message);
    }
}

/**
 * Broadcast a message to all connected clients.
 * @param {Object} message - The message object to send.
 */
function broadcastMessage(message) {
    Object.values(clients).forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
        }
    });
}

/**
 * Send a private message to a specific client.
 * @param {string} clientId - The ID of the client to send the message to.
 * @param {Object} message - The message object to send.
 */
function sendPrivateMessage(clientId, message) {
    const ws = clients[clientId];
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
    } else {
        console.warn(`Client ${clientId} is not connected`);
    }
}

/**
 * Generate a unique ID for each client.
 * @returns {string} - A unique ID.
 */
function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
}

module.exports = {
    setupWebSocketServer,
    broadcastMessage,
    sendPrivateMessage,
};
