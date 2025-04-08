import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // ✅ Adjust if your backend is deployed

const ChatRoom = ({ username }) => {
  const [room, setRoom] = useState('general');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit('joinRoom', room);

    socket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [room]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('sendMessage', { room, message, sender: username || 'Anonymous' });
      setMessage('');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Chat Room: {room}</h2>
      <div style={styles.messages}>
        {messages.map((msg, i) => (
          <div key={i} style={styles.msg}>
            <strong>{msg.sender}</strong>: {msg.message}
            <div style={styles.time}>{msg.time}</div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} style={styles.form}>
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Send</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: 600,
    margin: '0 auto',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  messages: {
    height: 300,
    overflowY: 'auto',
    border: '1px solid #ddd',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  msg: {
    marginBottom: 8,
  },
  time: {
    fontSize: '0.75em',
    color: '#999',
  },
  form: {
    display: 'flex',
    gap: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: 5,
  },
};

export default ChatRoom;
