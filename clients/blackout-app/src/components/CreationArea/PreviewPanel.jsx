import React from 'react';

export default function PreviewPanel({ html }) {
  return (
    <div className="preview-box" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
