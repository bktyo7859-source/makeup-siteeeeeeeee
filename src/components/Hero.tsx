import React, { useState } from 'react';
import { InteractiveVideoHero } from './InteractiveVideoHero';
import { HeroOverlay } from './HeroOverlay';
import './Hero.css';

interface HeroProps {
  onExploreClick: () => void;
  onShadeFinderClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onShadeFinderClick
}) => {
  const [, setHeroPhase] = useState<'intro' | 'interactive'>('intro');

  return (
    <section id="hero-section" className="hero-master-container" aria-label="Haute Cosmetics Campaign Hero">
      {/* 1. Pristine Fullscreen Interactive Video Hero */}
      <InteractiveVideoHero
        onPhaseChange={(phase) => setHeroPhase(phase)}
        videoSrc="/Woman_moving_head_slowly_1080p_20261004013426.mp4"
      />

      {/* 2. Haute Editorial Typography & Interaction Overlay */}
      <HeroOverlay
        onExploreClick={onExploreClick}
        onShadeFinderClick={onShadeFinderClick}
      />
    </section>
  );
};
