const socket = io();

    // Function to add messages to the chat
    function addMessage(message) {
      const messages = document.getElementById('messages');
      const li = document.createElement('li');
      li.textContent = message;
      messages.appendChild(li);
    }

    // Event listener for the form submission
    document.getElementById('messageForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const messageInput = document.getElementById('messageInput');
      const message = messageInput.value.trim();

      if (message !== '') {
        // Send the message to the server
        socket.emit('chat message', message);
        messageInput.value = '';
        addMessage(`You: ${message}`);
      }
    });

    // Request user's name
    socket.on('requestUsername', () => {
      const username = prompt('Please enter your name:');
      socket.emit('setUsername', username);
    });

    // Listen for messages from the server
    socket.on('chat message', (message) => {
      addMessage(message);
    });