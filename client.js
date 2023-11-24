const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Socket.io logic
io.on('connection', (socket) => {
  console.log('A user connected');

  // Ask for user's name
  socket.emit('requestUsername');

  // Listen for user's name
  socket.on('setUsername', (username) => {
    socket.username = username;
    io.emit('chat message', `${username} has joined the chat`);
  });

  // Listen for chat messages from the client
  socket.on('chat message', (message) => {
    // Broadcast the message to all connected clients
    io.emit('chat message', `${socket.username}: ${message}`);
  });

  // Disconnect event
  socket.on('disconnect', () => {
    if (socket.username) {
      io.emit('chat message', `${socket.username} has left the chat`);
    }
    console.log('User disconnected');
  });
});
