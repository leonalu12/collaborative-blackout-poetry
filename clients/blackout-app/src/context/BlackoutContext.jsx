import React, { createContext, useContext, useState,useEffect } from 'react';
import socket from '../utils/socket';

const BlackoutContext = createContext();

export const BlackoutProvider = ({ children }) => {
  const [rawText, setRawText] = useState('This is a sample text for blackout. You can edit or replace it.');
  const [formattedText, setFormattedText] = useState('');
  const [selectedColor, setSelectedColor] = useState('black');
  const [isBlackout, setIsBlackout] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isInGame, setIsInGame] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [words, setWords] = useState([]);
  const [roomId, setRoomId] = useState('');
  const [joinedRoom, setJoinedRoom] = useState(false); // New state to track if the room is joined

  const updateRoomState = (updatedFields) => {
    const nextState = {
      rawText,
      words,
      isBlackout,
      isInGame,
      ...updatedFields, // 局部更新
    };
    setRawText(nextState.rawText);
    setWords(nextState.words);
    setIsBlackout(nextState.isBlackout);
    setIsInGame(nextState.isInGame);
  
    if (roomId) {
      socket.emit('update-room-state', { roomId, ...nextState });
    }
  };
  
  useEffect(() => {
    socket.on('room-state', (roomState) => {
      console.log('📥 Received room state:', roomState);
      if (roomState.words) setWords(roomState.words);
      if (roomState.rawText !== undefined) setRawText(roomState.rawText);
      if (roomState.isBlackout !== undefined) setIsBlackout(roomState.isBlackout);
      if (roomState.isInGame !== undefined) setIsInGame(roomState.isInGame);
    });

    return () => {
      socket.off('room-state');
    };
  }, []);
  return (
    <BlackoutContext.Provider
      value={{
        rawText,
        setRawText,
        formattedText,
        setFormattedText,
        selectedColor,
        setSelectedColor,
        isBlackout,
        setIsBlackout,
        isGenerating,
        setIsGenerating,
        isInGame,
        setIsInGame,
        showUploadPopup,
        setShowUploadPopup,
        showSaveConfirmation,
        setShowSaveConfirmation,
        words,
        setWords,
        roomId,
        setRoomId,
        joinedRoom, 
        setJoinedRoom,
        socket, // Socket Instance
        updateRoomState
      }}
    >
      {children}
    </BlackoutContext.Provider>
  );
};

export const useBlackout = () => {
  const context = useContext(BlackoutContext);
  if (!context) {
    throw new Error('useBlackout must be used within a BlackoutProvider');
  }
  return context;
};