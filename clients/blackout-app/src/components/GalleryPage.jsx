import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/GalleryPage.css';
import '../styles/PoemModal.css';
import LikeButton from './CommunityInteraction/LikeButton';
import DocumentProfile from './DocumentProfile';
import Header from './Header';

export default function GalleryPage() {
  const API_BASE = import.meta.env.VITE_API_BASE;
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  const [documents, setDocuments] = useState([]);
  const [filter, setFilter] = useState('public');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  const itemsPerPage = 6;

  useEffect(() => {
    fetch(`${API_BASE}api/documents`)
      .then(res => res.json())
      .then(data => {
        const filteredDocs = data.filter(doc => {
          if (filter === 'public') {
            return doc.state === 'public';
          } else if (filter === 'private') {
            return doc.state === 'private' && doc.collaborators.some(c => c._id === userId);
          }
          return false;
        });
        setDocuments(filteredDocs);
      })
      .catch(err => {
        console.error('Failed to fetch documents:', err);
      });
  }, [filter]);

  useEffect(() => {
    if (selectedDoc) {
      setLikeCount(selectedDoc.likes?.length || 0);
      setLiked(selectedDoc.likes?.includes(userId) || false);
      setComments(selectedDoc.comments || []);
      setCommentText('');
    }
  }, [selectedDoc]);

  const handleFilter = (type) => {
    setFilter(type);
    setCurrentPage(1);
  };

  const handleCardClick = (doc) => {
    setSelectedDoc(doc);
  };

  const updateDocumentFromServer = async (docId) => {
    try {
      const res = await axios.get(`${API_BASE}api/documents/${docId}`);
      const updatedDoc = res.data;
      setDocuments(prevDocs =>
        prevDocs.map(doc => (doc._id === docId ? updatedDoc : doc))
      );
    } catch (err) {
      console.error('Error fetching updated document:', err);
    }
  };

  const filteredDocs = documents.filter(d =>
    filter === 'all' ? true : d.state === filter
  );

  const totalPages = Math.ceil(documents.length / itemsPerPage);
  const currentDocs = documents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="gallery-wrapper">
      <Header />
      
      <div className="gallery-page">
        <div className="sidebar">
          <Link to="/" className="nav-btn">Blackout</Link>
          <button className={`nav-btn ${filter === 'public' ? 'active' : ''}`} onClick={() => handleFilter('public')}>Public</button>
          <button className={`nav-btn ${filter === 'private' ? 'active' : ''}`} onClick={() => handleFilter('private')}>Private</button>
        </div>

        <div className="content-area">
          <h2>Gallery</h2>
          <div className="gallery-content-box">
            <div className="card-grid">
              {currentDocs.map(doc => (
                <div className="doc-card" key={doc._id}>
                  <div onClick={() => handleCardClick(doc)}>
                    <h3>{doc.documentName}</h3>
                    <p>{doc.content?.slice(0, 80)}...</p>
                  </div>
                  <div className="card-footer">
                    <Link 
                      to={`/${doc._id}`} 
                      onClick={e => e.stopPropagation()}
                    >
                      <button type="button" className="open-btn">
                        Open
                      </button>
                    </Link>

                    <LikeButton
                      documentId={doc._id}
                      initialLikes={doc.likes || []}
                      userId={userId}
                    />
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <ul className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                  <li
                    key={index}
                    className={currentPage === index + 1 ? "active-page" : ""}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {selectedDoc && (
          <DocumentProfile
            selectedDoc={documents.find(doc => doc._id === selectedDoc._id) || selectedDoc}
            userId={userId}
            closeModal={() => setSelectedDoc(null)}
            filter={filter}
          />
        )}
      </div>
    </div>
  );
}
