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

  // Socket操作封装
  const updateText = (text) => {
    setRawText(text);
    setFormattedText(text);
    if (roomId) {
      socket.emit('update-text', { roomId, text });
    }
  };

  const updateWords = (newWords) => {
    setWords(newWords);
    if (roomId) {
      socket.emit('update-words', { roomId, words: newWords, isBlackout,isInGame });
    }
  };

  const joinRoom = (roomId) => {
    setRoomId(roomId);
    socket.emit('join-poem-room', roomId);
  };

    // 初始化Socket监听
    useEffect(() => {
      const handleRoomState = (roomState) => {
        setRawText(roomState.rawText);
        setFormattedText(roomState.rawText);
        setWords(roomState.words);
        setIsInGame(roomState.isInGame);
      };
    socket.on('room-state', handleRoomState);
    socket.on('text-updated', handleRoomState);
    socket.on('words-updated', (data) => {
      setWords(data.words);
      if (data.isBlackout !== undefined) {
        setIsBlackout(data.isBlackout);
      }
    });

    return () => {
      socket.off('room-state', handleRoomState);
      socket.off('text-updated', handleRoomState);
      socket.off('words-updated', (data) => {
        setWords(data.words);
        if (data.isBlackout !== undefined) {
          setIsBlackout(data.isBlackout);
        }
      });
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
        updateText,
        updateWords,
        joinRoom,
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