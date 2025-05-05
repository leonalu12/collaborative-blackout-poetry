import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import '../styles/BlackoutEditor.css';

const socket = io('http://localhost:5050', {
    withCredentials: true
  });

function BlackoutEditor() {
  const [roomId, setRoomId] = useState('');
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [blackoutData, setBlackoutData] = useState([]);
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    if (!joinedRoom) return;

    socket.on('receive-blackout', (data) => {
      console.log('Received blackout:', data);
      setBlackoutData(prev => [...prev, data]);
    });

    return () => {
      socket.off('receive-blackout');
    };
  }, [joinedRoom]);

  const joinRoom = () => {
    if (!roomId.trim()) return;
    socket.emit('join-document', roomId);
    setJoinedRoom(true);
  };

  const handleBlackout = (newData) => {
    if (!joinedRoom) return;
    socket.emit('blackout-change', { documentId: roomId, blackoutData: newData });
    setBlackoutData(prev => [...prev, newData]);
  };

  const createRoom = () => {
    const newRoomId = crypto.randomUUID();
    setRoomId(newRoomId);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setCopySuccess('Failed to copy');
    }
  };

  const exitRoom = () => {
    socket.emit('leave-document', roomId); // optional for future cleanup
    setRoomId('');
    setJoinedRoom(false);
    setBlackoutData([]);
  };

  return (
    <div className="blackout-sidebar">
      {!joinedRoom ? (
        <>
          <button onClick={createRoom}>Create New Room</button>
          <input
            type="text"
            placeholder="Paste Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={joinRoom}>Join Room</button>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p className="room-id">
              Room ID: <code className="room-id">{roomId}</code>
            </p>
            <button onClick={copyToClipboard} style={{ marginBottom: '0.5rem' }}>
              Copy Room ID
            </button>
            {copySuccess && <span style={{ color: 'green', fontSize: '0.85rem' }}>{copySuccess}</span>}
          </div>
          <button onClick={() => handleBlackout(`Blackout at ${new Date().toLocaleTimeString()}`)}>
            Test Blackout
          </button>
          <button onClick={exitRoom} className="exit-button">
            Exit Room
          </button>
        </>
      )}
    </div>
  );
}

export default BlackoutEditor;