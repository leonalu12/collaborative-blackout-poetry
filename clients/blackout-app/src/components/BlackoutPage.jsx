import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBlackout } from '../context/BlackoutContext';
import TextInputPanel from './CreationArea/TextInputPanel';
import PreviewPanel from './CreationArea/PreviewPanel';
import CreationControls from './CreationArea/CreationControls';
import UploadArticle from './CreationArea/UploadArticle';
import Header from './Header';
import BlackoutEditor from './BlackoutEditor';
import SaveModal from './SaveModal/SaveModal';
import '../styles/BlackoutPage.css';
import EndGameButton from './EndGameButton';
import UploadImageOCR from './CreationArea/UploadImageOCR';
import Chatbox from './Chatbox';
import StatusView from './StatusView';

export default function BlackoutPage() {
  const API_BASE = import.meta.env.VITE_API_BASE;
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showUploadImagePopup, setShowUploadImagePopup] = useState(false);
  const [tempImageText, setTempImageText] = useState('');


  const navigate = useNavigate();
  const {
    title,
    setTitle,
    rawText,
    setRawText,
    blackoutWords,
    setBlackoutWords,
    formattedText,
    setFormattedText,
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
    updateRoomState,
    roomId,
    joinedRoom
  } = useBlackout();
  const fileInputRef = useRef(null); // 用于文件上传的引用

// 1) Fetch doc + blackoutWords
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API_BASE}api/documents/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load document');
        return res.json();
      })
      .then(data => {
        setDoc(data);
        setTitle(data.documentName);
        setRawText(data.content);

        setBlackoutWords(data.blackoutWords);    // [{ index: 0, length:1 }, …]
        setFormattedText(data.content);
        setIsBlackout(true);
        setIsInGame(true); 
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // 2) Re-init words whenever text OR blackoutWords changes
  useEffect(() => {
    const initialWords = initializeText(formattedText, blackoutWords);
    setWords(initialWords);
    updateRoomState({ words: initialWords });
  }, [formattedText, blackoutWords]);

  // 3) Split and tag
  const initializeText = (text, blackoutArr = []) => {
    const tokens = text.match(/\w+|[^\w\s]|[\s]+/gu) || [];

    if (id == null) {
      return tokens.map((token, index) => ({
        id: index,
        text: token,
        isBlackout: false,
        isSelected: false,
      }));

    }
    else {
      return tokens.map((token, idx) => {
        const isBlack = blackoutArr.some(bw =>
          idx >= bw.index && idx < bw.index + (bw.length || 1)
        );
        return {
          id: idx,
          text: token,
          isBlackout: !isBlack,
          isSelected: isBlack,
        };
      });
    }
  };

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
    const newBlackoutState = !isBlackout
    setIsBlackout(newBlackoutState);// Toggle the blackout state    

    updateRoomState({ words: updatedWords, isBlackout: newBlackoutState }); // Update the room state with the new blackout state
  }

  const handleLoadRandomPoem = async () => {
    if (isInGame) return; // 🚫 禁止修改 rawText
    try {
      const res = await fetch(`${API_BASE}api/documents/random`);
      if (!res.ok) throw new Error('Failed to fetch random document');
      const data = await res.json();

      setRawText(data.content);
      setIsBlackout(false);

      updateRoomState({
        rawText: data.content,
        isBlackout: false
      });
    } catch (err) {
      console.error(err);
      alert('Failed to load random poem.');
    }
  };




  const handleUploadText = (text) => {
    if (isInGame) return; // 🚫 已锁定，不允许上传替换 rawText
    setRawText(text);
    setFormattedText('');
    setIsBlackout(false);
    setShowUploadPopup(false); // Close the popup after confirmation

    updateRoomState({ rawText: text })
  };

  const handleSubmitInputText = (text) => {
    if (!text) return;
    // Check if the text is empty or contains only whitespace
    setRawText(text);
    setFormattedText(text);
    setIsBlackout(false);
    setIsInGame(true);// Set isInGame to true when text is submitted, cannot change texts.

    updateRoomState({ rawText: text, isInGame: true, isBlackout: false })
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
      updateRoomState({ rawText: text })
    } catch (err) {
      console.error("Generation failed:", err);
      // TODO: show a UI toast or inline error message
    } finally {
      setIsGenerating(false);
    }
  };

  // only show the spinner / error if we actually have an :id in the URL
  if (id && (loading || !doc)) {
    return <StatusView loading={loading} doc={doc} />;
  }


  return (
    <div className="blackout-wrapper">
      <Header />
      <div className="blackout-page">
        <div className="sidebar">
          <button className="nav-btn active">Blackout</button>
          <button className="nav-btn" 
          disabled={isInGame}
          title={isInGame ? 'Press Start New Game to get access to Gallery' : ''}
          style={{ backgroundColor: isInGame ? '#ccc' : `#8B5E3C`, color: isInGame ? '#666' : '#fff' }}
          onClick={() => navigate('/gallery')
          }>Gallery</button>
          <div>
            <BlackoutEditor />
          </div>
        </div>

        <div className="editor-area">
          <div className="top-buttons">
            <button className="round-btn" onClick={handleLoadRandomPoem} disabled={isInGame || isBlackout}>Get Random Poem</button>
            <button className="round-btn" onClick={() => setShowUploadPopup(true)} disabled={isInGame || isBlackout}>
              Upload your own article
            </button>
            <button className="round-btn" onClick={() => setShowUploadImagePopup(true)} disabled={isInGame || isBlackout}>Upload your image</button>
          </div>

          {showUploadPopup && (
            <div className="upload-popup">
              <div className="upload-popup-content">
                <h3>Upload a .txt file</h3>
                <UploadArticle ref={fileInputRef} onConfirm={handleUploadText} />
                <button className="close-btn" onClick={() => setShowUploadPopup(false)}>X</button>
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
                  X
                </button>
              </div>
            </div>
          )}
          <div className="text-box">
            <input
              type="text"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <TextInputPanel
            value={rawText}
            onChange={e => {
              if (isInGame || isBlackout) return;
              setRawText(e.target.value)
            }}
            onSubmit={handleSubmitInputText}
            onGenerate={handleGenerate}
            isInGame={isInGame}
          />
        </div>

        <div className="preview-area">
          <PreviewPanel
            onWordClick={handleWordClick}
          />
          <div className="action-buttons">

          <button className="blackout-btn" onClick={handleBlackout}>
            {isBlackout ? 'Unblackout' : 'Blackout'}
          </button>

            <button className="save-btn" onClick={() => setShowSaveConfirmation(true)}>Save</button>
            {isInGame && <EndGameButton />}
          </div>


        </div>

        {/* Save confirmation popup */}
        <SaveModal
          isOpen={showSaveConfirmation}
          onClose={() => setShowSaveConfirmation(false)}
          title={title}  // ✅ 传递标题
          words={words}  // ✅ 传递 blackout 处理的文本
          rawText={rawText}  // ✅ 传入 rawText
          documentId={id}  // ✅ 传入当前文档 ID
        />

        {joinedRoom && (
          <div className="chatbox-section active">
            <Chatbox />
          </div>
        )}
      </div>
    </div>
  );

}