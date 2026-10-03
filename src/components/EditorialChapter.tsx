import React, { useEffect, useRef } from 'react';
import { EditorialProductChapter } from '../types/editorial';
import { Sparkles } from 'lucide-react';
import { EditorialLink } from './EditorialLink';
import './EditorialChapter.css';

interface EditorialChapterProps {
  chapter: EditorialProductChapter;
  index: number;
  onViewProduct: (chapter: EditorialProductChapter) => void;
}

export const EditorialChapter: React.FC<EditorialChapterProps> = ({
  chapter,
  index,
  onViewProduct
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  // High-performance IntersectionObserver for cinematic video playback
  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    video.muted = true;
    video.playsInline = true;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id={`editorial-${chapter.id}`}
      className={`editorial-chapter-section theme-${chapter.theme} layout-${chapter.layoutVariant}`}
      aria-label={`${chapter.chapterNumber}: ${chapter.title}`}
    >
      <div className="chapter-wrapper">
        {/* Top Header Badge */}
        <div className="chapter-top-bar">
          <div className="chapter-indicator">
            <span className="chapter-index font-serif">{chapter.chapterNumber}</span>
            <span className="chapter-dot" aria-hidden="true">•</span>
            <span className="chapter-category">{chapter.category}</span>
          </div>
          <div className="chapter-campaign-tag">
            <Sparkles size={11} className="tag-sparkle" />
            <span>ÉDITION LIMITÉE 2026</span>
          </div>
        </div>

        {/* Main Content Layout Grid */}
        <div className="chapter-main-grid">
          {/* 1. Cinematic Video Frame (Dominant Media) */}
          <div className="chapter-video-column">
            <div className="video-cinematic-container">
              <video
                ref={videoRef}
                src={chapter.videoSrc}
                className="chapter-cinematic-video"
                loop
                muted
                playsInline
                preload="metadata"
              />
              <div className="video-corner-label">
                <span className="red-square" aria-hidden="true" />
                <span>CINEMATIC ARCHIVE 0{index + 1}</span>
              </div>
            </div>
          </div>

          {/* 2. Product Visual Spread (The 2 Product Images) */}
          <div className="chapter-images-column">
            {/* Primary Product Image */}
            <div
              className="editorial-image-card primary-image-card"
              onClick={() => onViewProduct(chapter)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onViewProduct(chapter)}
              aria-label={`View ${chapter.title} - ${chapter.image1Caption}`}
            >
              <div className="image-frame-inner">
                <img
                  src={chapter.image1}
                  alt={`${chapter.title} - ${chapter.image1Caption}`}
                  loading="lazy"
                  className="editorial-img"
                />
              </div>
              <div className="image-caption-row">
                <span className="caption-tag">FIG. 01</span>
                <span className="caption-text">{chapter.image1Caption}</span>
              </div>
            </div>

            {/* Secondary Product / Swatch / Detail Image */}
            <div
              className="editorial-image-card secondary-image-card"
              onClick={() => onViewProduct(chapter)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onViewProduct(chapter)}
              aria-label={`View ${chapter.title} - ${chapter.image2Caption}`}
            >
              <div className="image-frame-inner">
                <img
                  src={chapter.image2}
                  alt={`${chapter.title} - ${chapter.image2Caption}`}
                  loading="lazy"
                  className="editorial-img"
                />
              </div>
              <div className="image-caption-row">
                <span className="caption-tag">FIG. 02</span>
                <span className="caption-text">{chapter.image2Caption}</span>
              </div>
            </div>
          </div>

          {/* 3. Editorial Typography & Product Information Block */}
          <div className="chapter-info-column">
            <div className="info-cluster">
              <span className="red-accent-rule" aria-hidden="true" />
              
              <h2 className="chapter-headline font-serif">
                “{chapter.headline}”
              </h2>

              <h3 className="chapter-product-name font-serif">
                {chapter.title}
              </h3>

              <p className="chapter-description">
                {chapter.description}
              </p>

              {/* Formulation specs bullet list */}
              <ul className="chapter-specs-list">
                {chapter.details.slice(0, 3).map((item, idx) => (
                  <li key={idx}>
                    <span className="spec-bullet-dot" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Price & View Product Action Row */}
              <div className="chapter-action-bar">
                <div className="chapter-price-block">
                  <span className="price-tag-label">PRICE</span>
                  <div className="price-num-row">
                    <span className="price-amount font-serif">{chapter.pricePlaceholder}</span>
                    <span className="price-subtext">Price — Add price</span>
                  </div>
                </div>

                <EditorialLink
                  size="md"
                  onClick={() => onViewProduct(chapter)}
                  ariaLabel={`View product details for ${chapter.title}`}
                >
                  VIEW PRODUCT
                </EditorialLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
