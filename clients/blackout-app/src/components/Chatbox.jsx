// components/Chatbox.jsx
import { useState, useEffect } from 'react';
import { useBlackout } from '../context/BlackoutContext';
import '../styles/Chatbox.css';

function Chatbox() {
  const { socket, roomId, username } = useBlackout();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  // 监听收到的消息
  useEffect(() => {
    if (!socket) return;

    socket.on('receive-message', (messageData) => {
      setMessages(prevMessages => [...prevMessages, messageData]);
    });

    // 清理socket事件
    return () => {
      socket.off('receive-message');
    };
  }, [socket]);

  // 发送消息
  const sendMessage = () => {
    if (message.trim()) {
      const timestamp = new Date().toLocaleTimeString();
      socket.emit('send-message', { roomId, username, message, timestamp });
      setMessage(''); // 发送后清空输入框
    }
  };

  return (
    <div className="chatbox">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.username}</strong> <span>{msg.timestamp}</span>
            <p>{msg.message}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chatbox;
