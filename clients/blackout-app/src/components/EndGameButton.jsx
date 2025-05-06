import React from 'react';
import { useBlackout } from '../context/BlackoutContext'; // Import the context to manage state

const EndGameButton = () => {
    const {
        setIsInGame,
        setRawText,
        setWords
    } = useBlackout(); // Import the context to manage state
    const handleEndGame = () => {
        setIsInGame(false);
        setRawText('New game started!'); // Reset the raw text or set it to a new value
        setWords([]);
    };

    return (
        <button onClick={handleEndGame} className="end-game-button">
            End Game
        </button>
    );
};

export default EndGameButton;