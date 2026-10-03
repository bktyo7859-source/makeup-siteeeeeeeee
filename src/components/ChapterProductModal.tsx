import React from 'react';
import { EditorialProductChapter } from '../types/editorial';
import { X, ShieldCheck } from 'lucide-react';
import { EditorialLink } from './EditorialLink';
import './ChapterProductModal.css';

interface ChapterProductModalProps {
  chapter: EditorialProductChapter | null;
  onClose: () => void;
}

export const ChapterProductModal: React.FC<ChapterProductModalProps> = ({
  chapter,
  onClose
}) => {
  if (!chapter) return null;

  return (
    <div className="chapter-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="chapter-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="chapter-modal-close"
          onClick={onClose}
          aria-label="Close product view"
        >
          <X size={20} />
        </button>

        <div className="chapter-modal-grid">
          {/* Media Column */}
          <div className="chapter-modal-media-col">
            <div className="modal-primary-image-frame">
              <img src={chapter.image1} alt={chapter.title} className="modal-product-img" />
              <span className="modal-caption-tag">{chapter.image1Caption}</span>
            </div>
            <div className="modal-secondary-image-frame">
              <img src={chapter.image2} alt={chapter.title} className="modal-product-img" />
              <span className="modal-caption-tag">{chapter.image2Caption}</span>
            </div>
          </div>

          {/* Details Column */}
          <div className="chapter-modal-info-col">
            <div className="modal-header-meta">
              <span className="modal-chapter-num">{chapter.chapterNumber}</span>
              <span className="modal-category-name">{chapter.category}</span>
            </div>

            <h2 className="modal-product-title font-serif">{chapter.title}</h2>
            <p className="modal-headline font-serif">“{chapter.headline}”</p>

            <div className="red-editorial-divider" />

            <p className="modal-description">{chapter.description}</p>

            {/* Performance Specifications */}
            <div className="modal-specs-block">
              <span className="specs-title">HAUTE FORMULATION SPECIFICATIONS:</span>
              <ul className="specs-list">
                {chapter.details.map((detail, idx) => (
                  <li key={idx}>
                    <span className="spec-red-dot" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price & Action (Text-Only Editorial CTA) */}
            <div className="modal-purchase-footer">
              <div className="modal-price-box">
                <span className="price-label">PRICE</span>
                <span className="price-value font-serif">{chapter.pricePlaceholder}</span>
                <span className="price-subnote">Price — Add price / Inquiry</span>
              </div>

              <EditorialLink
                size="md"
                onClick={() => {
                  alert(`Thank you for your interest in ${chapter.title}. Pricing and bespoke concierge availability will be announced shortly.`);
                  onClose();
                }}
                ariaLabel={`Inquire about ${chapter.title}`}
              >
                INQUIRE ABOUT PIECE
              </EditorialLink>
            </div>

            <div className="modal-guarantee-row">
              <ShieldCheck size={14} className="guar-icon-red" />
              <span>Complimentary Haute Presentation Box & Deluxe Miniature</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
