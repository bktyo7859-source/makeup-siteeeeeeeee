import React from 'react';
import { EditorialLink } from './EditorialLink';
import './HeroCTA.css';

interface HeroCTAProps {
  onExploreClick?: () => void;
  onShadeFinderClick?: () => void;
}

export const HeroCTA: React.FC<HeroCTAProps> = ({
  onExploreClick,
  onShadeFinderClick
}) => {
  return (
    <div className="hero-cta-container">
      <EditorialLink
        id="hero-explore-btn"
        size="md"
        onClick={onExploreClick}
        ariaLabel="Shop the luxury beauty collection"
      >
        SHOP COLLECTION
      </EditorialLink>

      <EditorialLink
        id="hero-shade-finder-btn"
        size="md"
        variant="muted"
        onClick={onShadeFinderClick}
        ariaLabel="Launch interactive bespoke shade finder"
      >
        FIND YOUR SHADE
      </EditorialLink>
    </div>
  );
};
