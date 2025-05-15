
import { useState, useEffect } from 'react';
import { useBlackout } from '../context/BlackoutContext';
import '../styles/Chatbox.css';
import { useRef } from 'react';

function Chatbox() {
  const { socket, roomId, user } = useBlackout();
  const username = user?.name || 'Anonymous';
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);



  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest'
    });
  };
  

useEffect(() => {
  scrollToBottom();
}, [messages]);


  useEffect(() => {
    if (!socket) return;

    socket.on('receive-message', (messageData) => {
      setMessages(prevMessages => [...prevMessages, messageData]);
    });

   
    return () => {
      socket.off('receive-message');
    };
  }, [socket]);


  const sendMessage = () => {
    if (message.trim()) {
      const timestamp = new Date().toLocaleTimeString();
      socket.emit('send-message', { roomId, username, message, timestamp });
      setMessage(''); 
    }
  };

  return (
    <div className="chatbox">
      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.username === username ? 'self' : 'other'}`}
          >
            <div style={{ fontSize: '0.8em', marginBottom: '0.25em', color: '#555' }}>
              <strong>{msg.username}</strong> <span>{msg.timestamp}</span>
            </div>
            <div>{msg.message}</div>
          </div>
        ))}
         <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
      <input
        type="text"
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chatbox;
