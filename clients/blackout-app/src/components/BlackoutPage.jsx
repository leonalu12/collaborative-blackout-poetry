import React, { useState, useRef,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ColorPicker from './ColorPicker';
import TextInputPanel from './CreationArea/TextInputPanel';
import PreviewPanel from './CreationArea/PreviewPanel';
import CreationControls from './CreationArea/CreationControls';
import UploadArticle from './CreationArea/UploadArticle';
import LogoutButton from './LogoutButton';
import SaveModal from './SaveModal/SaveModal';
import logo from '../assets/logo_poem.png';
import '../styles/BlackoutPage.css';

export default function BlackoutPage() {
  const navigate = useNavigate();
  const [rawText, setRawText] = useState('This is a sample text for blackout. You can edit or replace it.');
  const [formattedText, setFormattedText] = useState('');
  const [selectedColor, setSelectedColor] = useState('black');
  const [isBlackout, setIsBlackout] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);

  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  const fileInputRef = useRef();
  const [words, setWords] = useState([]);

    useEffect(() => {
      document.title = 'Blackout App';
    }, []);

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
  }, [formattedText]);

  // This function is called when the user clicks on a word in the preview panel.
    const handleWordClick = (wordId) => {
      if(isBlackout) return; // Do nothing if blackout is active
      setWords(words.map(word => 
        word.id === wordId ? { ...word, isSelected: !word.isSelected } : word)
         // Toggle the selected state of the clicked word
      ); 
    };

// This function is called when a word is clicked. It toggles the blackout state of the selected word.
    const handleBlackout = () => {
        const updatedWords = words.map(word => {
          if(isBlackout){
            //已涂黑，取消单词涂黑
            return{ ...word, isBlackout: false };
          }else{
            //未涂黑，涂黑单词
            return word.isSelected
            ? { ...word, isBlackout: false } // Keep selected words
            : { ...word, isBlackout: true }; // Blackout everything else
          }
        });
        //rerender the component with the updated words
        setWords(updatedWords);
        setIsBlackout(!isBlackout);// Toggle the blackout state
    }
    

  const handleLoadExample = () => {
    const newText = 'Every word you blackout reveals a new layer of meaning.';
    setRawText(newText);
    setFormattedText('');
    setIsBlackout(false);
  };


  const handleUploadText = (text) => {
    setRawText(text);
    setFormattedText('');
    setIsBlackout(false);
    setShowUploadPopup(false); // Close the popup after confirmation
  };

  const handleSubmitInputText = (text) => {
    if (!text) return;
    // Check if the text is empty or contains only whitespace
    setRawText(text);
    setFormattedText(text);
    setIsBlackout(false);
  }

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const resp = await fetch("http://localhost:5050/api/generate", {
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
          <button className="nav-btn">Gallery</button>
        </div>

        <div className="editor-area">
          <div className="top-buttons">
            <button className="round-btn" onClick={handleLoadExample}>Get Random Poem</button>
            <button className="round-btn" onClick={() => setShowUploadPopup(true)}>
              Upload your own article
            </button>
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

          <TextInputPanel
                  value={rawText}
                  onChange={e => setRawText(e.target.value)}
                  onSubmit={handleSubmitInputText}
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
          />

          <ColorPicker onColorChange={setSelectedColor} />
          <button className="custom-color-btn">Your Color</button>
        </div>

        <div className="preview-area">
          <PreviewPanel 
          words={words} 
          onWordClick={handleWordClick}
          selectedColor={selectedColor}//选中的边框颜色
          isBlackout={isBlackout}
          />
          <CreationControls
            isBlackout={isBlackout}
            onBlackout={handleBlackout}
            onSave={() => setShowSaveConfirmation(true)}
          />
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
