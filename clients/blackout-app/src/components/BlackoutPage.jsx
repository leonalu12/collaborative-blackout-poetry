import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlackout } from '../context/BlackoutContext';
import ColorPicker from './ColorPicker';
import TextInputPanel from './CreationArea/TextInputPanel';
import PreviewPanel from './CreationArea/PreviewPanel';
import CreationControls from './CreationArea/CreationControls';
import UploadArticle from './CreationArea/UploadArticle';
import LogoutButton from './LogoutButton';
import BlackoutEditor from './BlackoutEditor';
import SaveModal from './SaveModal/SaveModal';
import logo from '../assets/logo_poem.png';
import '../styles/BlackoutPage.css';
import EndGameButton from './EndGameButton';
import UploadImageOCR from './CreationArea/UploadImageOCR';

export default function BlackoutPage() {
  const API_BASE = import.meta.env.VITE_API_BASE;
  const [showUploadImagePopup, setShowUploadImagePopup] = useState(false);
  const [tempImageText, setTempImageText] = useState('');

  const navigate = useNavigate();
  const {
    rawText,
    setRawText,
    formattedText,
    setFormattedText,
    selectedColor,
    setSelectedColor,
    isBlackout,
    setIsBlackout,
    setIsGenerating,
    isInGame,
    setIsInGame,
    showUploadPopup,
    setShowUploadPopup,
    showSaveConfirmation,
    setShowSaveConfirmation,
    words,
    setWords,
    updateRoomState
  } = useBlackout();
  const fileInputRef = useRef(null); // 用于文件上传的引用

  // 将formattedText文本分割成单词和空格，并为每个单词添加一个唯一的ID
  const initializeText = (text) => {
    const tokens = text.match(/\w+|[^\w\s]|[\s]+/gu) || [];
    //\w+：连续的字母数字（即单词）[^\w\s]：非字母数字、非空格的符号（例如 , . ! ?）[\s]+：连续的空格、换行、制表符等
    return tokens.map((token, index) => ({
      id: index,
      text: token,
      isBlackout: false,
      isSelected: false,
      selectedColor: selectedColor,
    }))
  }
  // This function is called when the component mounts or when the formattedText changes.
  useEffect(() => {
    setWords(initializeText(formattedText));
    updateRoomState({ words: initializeText(formattedText) });
  }, [formattedText]);

  // This function is called when the user clicks on a word in the preview panel.
  const handleWordClick = (wordId) => {
    if (isBlackout) return; // Do nothing if blackout is active
    const newWords = words.map(word =>
      word.id === wordId ? { ...word, isSelected: !word.isSelected } : word)
    // Toggle the selected state of the clicked word
    setWords(newWords);
    updateRoomState({ words: newWords }); // Update the room state with the new words
  };

  // This function is called when a word is clicked. It toggles the blackout state of the selected word.
  const handleBlackout = () => {
    const updatedWords = words.map(word => {
      if (isBlackout) {
        //已涂黑，取消单词涂黑
        return { ...word, isBlackout: false };
      } else {
        //未涂黑，涂黑单词
        return word.isSelected
          ? { ...word, isBlackout: false } // Keep selected words
          : { ...word, isBlackout: true }; // Blackout everything else
      }
    });
    //rerender the component with the updated words
    setWords(updatedWords);
    const newBlackoutState = !isBlackout; // Toggle the blackout state
    setIsBlackout(newBlackoutState);// Toggle the blackout state    
    
    updateRoomState({ words: updatedWords, isBlackout: newBlackoutState }); // Update the room state with the new blackout state
  }

  const handleLoadExample = () => {
    const newText = 'Every word you blackout reveals a new layer of meaning.';
    setRawText(newText);
    setFormattedText('');
    setIsBlackout(false);

    updateRoomState({rawText: newText })
  };


  const handleUploadText = (text) => {
    setRawText(text);
    setFormattedText('');
    setIsBlackout(false);
    setShowUploadPopup(false); // Close the popup after confirmation

    updateRoomState({rawText: text })
  };

  const handleSubmitInputText = (text) => {
    if (!text) return;
    // Check if the text is empty or contains only whitespace
    setRawText(text);
    setFormattedText(text);
    setIsBlackout(false);
    setIsInGame(true);// Set isInGame to true when text is submitted, cannot change texts.

    updateRoomState({rawText: text, isInGame: true, isBlackout: false })
  }

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const resp = await fetch(`${API_BASE}api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || resp.statusText);
      }
      const { text } = await resp.json();
      setRawText(text);
      setFormattedText("");
      setIsBlackout(false);
      updateRoomState({rawText: text })
    } catch (err) {
      console.error("Generation failed:", err);
      // TODO: show a UI toast or inline error message
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="blackout-wrapper">
      <header className="blackout-header">
        <div className="header-left">
          <img src={logo} alt="Logo" className="header-logo" />
          <h1 className="header-title">Blackout Poem</h1>
        </div>

        <LogoutButton />
      </header>
      <div className="blackout-page">
        <div className="sidebar">
          <button className="nav-btn active">Blackout</button>
          <button className="nav-btn" onClick={() => navigate('/gallery')}>Gallery</button>
          <div>
            <BlackoutEditor />
          </div>
        </div>

        <div className="editor-area">
          <div className="top-buttons">
            <button className="round-btn" onClick={handleLoadExample}>Get Random Poem</button>
            <button className="round-btn" onClick={() => setShowUploadPopup(true)}>
              Upload your own article
            </button>
            <button className="round-btn" onClick={() => setShowUploadImagePopup(true)}>Upload your image</button>
          </div>

          {showUploadPopup && (
            <div className="upload-popup">
              <div className="upload-popup-content">
                <h3>Upload a .txt file</h3>
                <UploadArticle ref={fileInputRef} onConfirm={handleUploadText} />
                <button className="close-btn" onClick={() => setShowUploadPopup(false)}>Close</button>
              </div>
            </div>
          )}

          {showUploadImagePopup && (        //
            <div className="upload-popup">
              <div className="upload-popup-content">
                <h3>Upload an image</h3>
                <UploadImageOCR onConfirm={setTempImageText} />
                {tempImageText && (
                  <>
                    <p
                      style={{
                        whiteSpace: 'pre-wrap',
                        maxHeight: '150px',
                        overflowY: 'auto',
                        border: '1px solid #ccc',
                        padding: '10px',
                        fontFamily: 'monospace',
                      }}
                    >
                      {tempImageText}
                    </p>
                    <button
                      className="confirm-btn"
                      onClick={() => {
                        setRawText(tempImageText); // 把识别的文本填入主输入框
                        setShowUploadImagePopup(false); 
                        setTempImageText(''); 
                      }}
                    >
                      Confirm
                    </button>
                  </>
                )}

                <button className="close-btn" onClick={() => setShowUploadImagePopup(false)}>
                  Close
                </button>
              </div>
            </div>
          )}

          <TextInputPanel
            value={rawText}
            onChange={e => setRawText(e.target.value)}
            onSubmit={handleSubmitInputText}
            onGenerate={handleGenerate}
          />

          <ColorPicker onColorChange={setSelectedColor} />
          <button className="custom-color-btn">Your Color</button>
        </div>

        <div className="preview-area">
          <PreviewPanel
            onWordClick={handleWordClick}
          />
          <CreationControls
            isBlackout={isBlackout}
            onBlackout={handleBlackout}
            onSave={() => setShowSaveConfirmation(true)}
          />
          {isInGame && (
            <EndGameButton />
          )}
        </div>

        {/* Save confirmation popup */}
        <SaveModal
          isOpen={showSaveConfirmation}
          onClose={() => setShowSaveConfirmation(false)}
        />
      </div>
    </div>
  );
}
