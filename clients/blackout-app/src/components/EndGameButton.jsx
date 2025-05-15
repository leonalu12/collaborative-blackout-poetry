import React from 'react';
import { useBlackout } from '../context/BlackoutContext'; // Import the context to manage state
import { useNavigate } from 'react-router-dom';

const EndGameButton = () => {
    const navigate = useNavigate();
    const {
        setIsInGame,
        setTitle,
        setRawText,
        setBlackoutWords,
        setFormattedText,
        setWords,
        updateRoomState,
        setIsBlackout,
    } = useBlackout(); // Import the context to manage state
    const handleEndGame = () => {
        setIsInGame(false);
        setIsBlackout(false);
        setTitle(''); // Reset the title or set it to a new value
        // setRawText('New game started!'); // Reset the raw text or set it to a new value
        setBlackoutWords([]); // Clear the blackout words
        setFormattedText(''); // Reset the formatted text
        setWords([]);
        
        // updateRoomState({ rawText:'New game started!', words:[], isInGame:false }); // Update the room state to reflect the end of the game
        updateRoomState({
            title: '',
            rawText: '',
            formattedText: '',
            blackoutWords: [],
            words: [],
            isInGame: false,
            isBlackout: false
          });
          
        navigate('/', { replace: true });
    };

    return (
        <button onClick={handleEndGame} className="end-game-button">
            Start New Game
        </button>
    );
};

export default EndGameButton;