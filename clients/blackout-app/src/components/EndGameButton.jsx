import React from 'react';
import { useBlackout } from '../context/BlackoutContext'; // Import the context to manage state

const EndGameButton = () => {
    const {
        setIsInGame,
        setRawText,
        setWords,
        updateRoomState
    } = useBlackout(); // Import the context to manage state
    const handleEndGame = () => {
        setIsInGame(false);
        setRawText('New game started!'); // Reset the raw text or set it to a new value
        setWords([]);
        
        updateRoomState({ rawText:'New game started!', words:[], isInGame:false }); // Update the room state to reflect the end of the game
    };

    return (
        <button onClick={handleEndGame} className="end-game-button">
            start New Game
        </button>
    );
};

export default EndGameButton;