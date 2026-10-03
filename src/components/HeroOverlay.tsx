import React from 'react';
import { HeroCTA } from './HeroCTA';
import { ScrollIndicator } from './ScrollIndicator';
import './HeroOverlay.css';

interface HeroOverlayProps {
  onExploreClick: () => void;
  onShadeFinderClick: () => void;
}

export const HeroOverlay: React.FC<HeroOverlayProps> = ({
  onExploreClick,
  onShadeFinderClick
}) => {
  return (
    <div className="hero-editorial-overlay">
      {/* Top Header Identity Brand mark */}
      <div className="hero-top-bar">
        <div className="hero-brand-meta">
          <span className="brand-heritage">ÉDITION LIMITÉE • PARIS</span>
          <span className="brand-dot" aria-hidden="true">•</span>
          <span className="brand-science">HAUTE COMPLEXION 2026</span>
        </div>
      </div>

      {/* Main Content Area - Positioned cleanly in lower-left corner so face remains center stage */}
      <div className="hero-content-cluster">
        <div className="hero-editorial-tag">
          <span className="red-dash" aria-hidden="true" />
          <span>BEAUTY / UNFILTERED</span>
        </div>

        <h1 className="hero-main-title font-serif">
          The Architecture <br />
          <span className="title-italic-accent">of Radiant Skin</span>
        </h1>

        <p className="hero-description">
          Sculpted by light. Perfected by French bio-cellular botanical science. 
          Move cursor horizontally to illuminate dimensional contours.
        </p>

        <HeroCTA
          onExploreClick={onExploreClick}
          onShadeFinderClick={onShadeFinderClick}
        />
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="hero-bottom-bar">
        <div className="hero-meta-note">
          <span className="meta-number">01</span>
          <span className="meta-text">HAUTE ILLUMINATION</span>
        </div>

        <div className="hero-scroll-wrapper">
          <ScrollIndicator onClick={onExploreClick} />
        </div>

        <div className="hero-meta-note right">
          <span className="meta-text">100% BOTANICAL CELLULAR EXTRACT</span>
        </div>
      </div>
    </div>
  );
};
