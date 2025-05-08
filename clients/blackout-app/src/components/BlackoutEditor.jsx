import { useState } from 'react';
import '../styles/BlackoutEditor.css';
import { useBlackout } from '../context/BlackoutContext'; 

function BlackoutEditor( {  }) {
  const {
    socket,
    roomId, setRoomId,
    joinedRoom, setJoinedRoom,
    // words, rawText, isBlackout, isInGame,  
    setWords, setRawText, setIsBlackout, setIsInGame
  } = useBlackout();


  const [copySuccess, setCopySuccess] = useState('');


  const joinRoom = () => {
    if (!roomId.trim()) return;
    socket.emit('join-document', roomId);
    setJoinedRoom(true);
    console.log(`Joined room: ${roomId}`);
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
    setWords([]);
    setRawText('Left the room!');
    setIsBlackout(false);
    setIsInGame(false);
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

          <button onClick={exitRoom} className="exit-button">
            Exit Room
          </button>
        </>
      )}
    </div>
  );
}

export default BlackoutEditor;