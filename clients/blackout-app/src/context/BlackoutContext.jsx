import React, { createContext, useContext, useState,useEffect } from 'react';
import socket from '../utils/socket';

const BlackoutContext = createContext();

export const BlackoutProvider = ({ children }) => {
  const [title, setTitle] = useState('');
  const [rawText, setRawText] = useState('This is a sample text for blackout. You can edit or replace it.');
  const [blackoutWords, setBlackoutWords] = useState([]);
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
  const [user, setUser] = useState(null);

  const updateRoomState = (updatedFields) => {
    const nextState = {
      title,
      rawText,
      blackoutWords,
      words,
      isBlackout,
      isInGame,
      ...updatedFields, // 局部更新
    };
    setTitle(nextState.title);
    setRawText(nextState.rawText);
    setBlackoutWords(nextState.blackoutWords);
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
      if (roomState.title !== undefined) setTitle(roomState.title);
      if (roomState.rawText !== undefined) setRawText(roomState.rawText);
      if (roomState.blackoutWords !== undefined) setBlackoutWords(roomState.blackoutWords);
      if (roomState.isBlackout !== undefined) setIsBlackout(roomState.isBlackout);
      if (roomState.isInGame !== undefined) setIsInGame(roomState.isInGame);
    });

    return () => {
      socket.off('room-state');
    };
  }, []);

  // 🔹 在初始加载时自动从 localStorage 中恢复用户信息
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Invalid user data in localStorage');
      }
    }
  }, []);

  return (
    <BlackoutContext.Provider
      value={{
        title,
        setTitle,
        rawText,
        setRawText,
        blackoutWords,
        setBlackoutWords,
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
        updateRoomState,
        user,
        setUser
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