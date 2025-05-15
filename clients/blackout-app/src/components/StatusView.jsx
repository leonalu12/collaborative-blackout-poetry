
import React from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/StatusView.css'; 

export default function StatusView({ loading, doc, backPath = '/gallery' }) {
  if (loading) {
    return (
        <div className="status-view status-view--loading">
            <Loader2 className="status-view__spinner" />
            <span className="status-view__text">Loading…</span>
        </div>
    );
  }

  if (!doc) {
    return (
        <div className="status-view">
            <AlertTriangle className="status-view__icon" />
                <h3 className="status-view__title">Document Not Found</h3>
                <p className="status-view__description">
                    Sorry, we can’t find the document you’re looking for.
                </p>
            <Link to={backPath}>
                <button className="status-view__button">Back to Gallery</button>
            </Link>
        </div>
    );
  }

  return null;
}