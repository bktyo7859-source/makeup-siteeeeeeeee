import React from 'react';
import { Award, Sparkles } from 'lucide-react';
import './PressAccolades.css';

export const PressAccolades: React.FC = () => {
  const accolades = [
    {
      source: 'VOGUE',
      quote: '“The closest thing to Parisian couture captured in liquid form. The second-skin light refraction is simply unmatched.”',
      author: 'Beauty Director, Vogue Paris'
    },
    {
      source: 'HARPER’S BAZAAR',
      quote: '“Maison Lumière has unlocked the secret to glass skin without weight. The 24K bio-peptide formula is a masterpiece.”',
      author: 'Best In Luxury Beauty 2026'
    },
    {
      source: 'ELLE INTERNATIONAL',
      quote: '“An optical revolution in complexion artistry. Melts into skin with pure cellular hydration.”',
      author: 'Grand Prix De La Beauté'
    }
  ];

  return (
    <section id="press-section" className="press-section" aria-label="Press accolades and reviews">
      <div className="press-container">
        <div className="press-crest-badge">
          <Award size={20} className="crest-icon" />
          <span>OFFICIAL SELECTION • COUTURE EXCELLENCE</span>
        </div>

        <div className="press-quotes-grid">
          {accolades.map((acc) => (
            <div key={acc.source} className="press-quote-card">
              <span className="press-logo font-serif">{acc.source}</span>
              <p className="press-quote font-serif">{acc.quote}</p>
              <div className="press-author-row">
                <Sparkles size={12} className="author-sparkle" />
                <span className="press-author">{acc.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
