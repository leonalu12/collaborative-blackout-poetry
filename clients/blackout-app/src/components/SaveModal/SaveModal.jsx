import React from 'react';
import './SaveModal.css';
import html2canvas from 'html2canvas';

const SaveModal = ({ isOpen, onClose, title, words }) => {

  if (!isOpen) return null;

  const handleSaveToGallery = async () => {
    if (!title?.trim()) {  // ✅ 确保 `title` 定义正确
      alert("Please enter a title before saving!");
      return;
    }
  
    if (!words || words.length === 0) {  // ✅ 确保 `words` 存在
      alert("No blackout words selected!");
      return;
    }
  
    // 提取 blackout 的文本
    const blackoutWordsArray = words
      .filter(word => word.isBlackout)
      .map(word => ({ index: word.id, text: word.text }));
  
    try {
      const response = await fetch("http://localhost:5050/api/documents", {


        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentName: title, 
          blackoutWords: blackoutWordsArray, 
          state: "public",
        }),
      });
  
      if (!response.ok) throw new Error("Failed to save");
  
      alert("Saved to gallery successfully!");
      onClose();
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving document.");
    }
  };
    

  const handleSaveAsJPG = async() => {
    try{
      const PreviewPanel = document.querySelector('.preview-box');// Get the PreviewPanel element
      //setting the canvas to the size of the PreviewPanel
      const canvas = await html2canvas(PreviewPanel, { 
        scale: 2, // Increase scale for better resolution
        useCORS: true, // Enable cross-origin image loading
        backgroundColor: null // Set background color to transparent
      });

      // Convert the canvas to an image
      const imgData = canvas.toDataURL('image/jpeg', 1.0); // Convert to JPG format
    
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'blackout_poem.jpg'; // Set the filename
      document.body.appendChild(link); // Append the link to the body (required for Firefox)
      link.click(); // Trigger the download
      document.body.removeChild(link); // Remove the link from the body
    }catch(error){
    console.error('Save as JPG failed:', error);
    alert('Failed to save as JPG. Please try again.');
    }
    // Close the modal after saving
    onClose();
  };

  return (
    <div className="save-confirmation-popup">
      <div className="save-confirmation-content">
        <h3>Where would you like to save your blackout poem?</h3>
        <div className="save-buttons">
          <button onClick={handleSaveToGallery}>
            Save to Gallery
          </button>
          <button onClick={handleSaveAsJPG}>
            Save as JPG
          </button>
        </div>
        <button className="close-btn" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default SaveModal;
