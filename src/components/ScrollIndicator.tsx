import React from 'react';
import './ScrollIndicator.css';

interface ScrollIndicatorProps {
  onClick?: () => void;
}

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ onClick }) => {
  return (
    <div
      className="hero-scroll-indicator"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label="Scroll down to explore collection"
    >
      <span className="scroll-label">EXPLORE</span>
      <div className="scroll-track" aria-hidden="true">
        <div className="scroll-dot" />
      </div>
    </div>
  );
};
