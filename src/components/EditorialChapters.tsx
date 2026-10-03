import React, { useState } from 'react';
import { EDITORIAL_CHAPTERS } from '../data/chapters';
import { EditorialProductChapter } from '../types/editorial';
import { EditorialChapter } from './EditorialChapter';
import { ChapterProductModal } from './ChapterProductModal';
import './EditorialChapters.css';

export const EditorialChapters: React.FC = () => {
  const [selectedChapter, setSelectedChapter] = useState<EditorialProductChapter | null>(null);

  return (
    <div className="editorial-chapters-wrapper" aria-label="Editorial Beauty Campaign Chapters">
      {/* Editorial Chapter Sequence (5 Major Product Chapters) */}
      {EDITORIAL_CHAPTERS.map((chapter, index) => (
        <EditorialChapter
          key={chapter.id}
          chapter={chapter}
          index={index}
          onViewProduct={(ch) => setSelectedChapter(ch)}
        />
      ))}

      {/* Quick View Product Modal */}
      <ChapterProductModal
        chapter={selectedChapter}
        onClose={() => setSelectedChapter(null)}
      />
    </div>
  );
};
