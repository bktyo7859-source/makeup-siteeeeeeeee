import React, { useState } from 'react';
import { Product, Shade } from '../types';
import { Sparkles, Check, X } from 'lucide-react';
import { EditorialLink } from './EditorialLink';
import './InteractiveShadeFinder.css';

interface InteractiveShadeFinderProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddToCart: (product: Product, shade?: Shade) => void;
}

export const InteractiveShadeFinder: React.FC<InteractiveShadeFinderProps> = ({
  isOpen,
  onClose,
  products,
  onAddToCart
}) => {
  const [step, setStep] = useState<number>(1);
  const [skinTone, setSkinTone] = useState<string>('light-medium');
  const [undertone, setUndertone] = useState<string>('warm');
  const [finish, setFinish] = useState<string>('dewy');
  const [isAdded, setIsAdded] = useState<boolean>(false);

  if (!isOpen) return null;

  const foundation = products.find(p => p.id === 'fond-de-teint-soie-pure');
  const lipstick = products.find(p => p.id === 'baume-levres-haute-couture');

  // Match shade based on answers
  const getRecommendedShade = (): Shade => {
    if (!foundation || !foundation.shades) {
      return { id: '20w', name: '20W Albâtre Doré', hex: '#F2D5BD', description: 'Light with warm golden undertones' };
    }
    if (skinTone === 'fair') return foundation.shades[0];
    if (skinTone === 'light-medium') {
      return undertone === 'warm' ? foundation.shades[1] : foundation.shades[2];
    }
    if (skinTone === 'tan') {
      return undertone === 'neutral' ? foundation.shades[3] : foundation.shades[4];
    }
    return foundation.shades[5];
  };

  const getRecommendedLipShade = (): Shade | undefined => {
    if (!lipstick || !lipstick.shades) return undefined;
    if (undertone === 'cool') return lipstick.shades[0];
    if (undertone === 'warm') return lipstick.shades[2];
    return lipstick.shades[1];
  };

  const matchedFoundationShade = getRecommendedShade();
  const matchedLipShade = getRecommendedLipShade();

  const handleAddBespokePair = () => {
    if (foundation) onAddToCart(foundation, matchedFoundationShade);
    if (lipstick && matchedLipShade) onAddToCart(lipstick, matchedLipShade);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1400);
  };

  const handleReset = () => {
    setStep(1);
    setSkinTone('light-medium');
    setUndertone('warm');
    setFinish('dewy');
  };

  return (
    <div className="shade-finder-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="shade-finder-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="finder-header">
          <div className="finder-badge">
            <Sparkles size={14} />
            <span>HAUTE AI SHADE ARCHITECTURE</span>
          </div>
          <button type="button" className="finder-close-btn" onClick={onClose} aria-label="Close shade finder">
            <X size={20} />
          </button>
        </div>

        {/* Step Progress */}
        <div className="finder-progress-track">
          <div className={`progress-segment ${step >= 1 ? 'is-active' : ''}`} />
          <div className={`progress-segment ${step >= 2 ? 'is-active' : ''}`} />
          <div className={`progress-segment ${step >= 3 ? 'is-active' : ''}`} />
          <div className={`progress-segment ${step >= 4 ? 'is-active' : ''}`} />
        </div>

        {/* Step 1: Skin Tone */}
        {step === 1 && (
          <div className="finder-step-body">
            <span className="step-num-tag">STEP 01 OF 03</span>
            <h3 className="step-question font-serif">What is your natural skin depth?</h3>
            <p className="step-hint">Select the tone that best reflects your bare complexion in natural daylight.</p>

            <div className="tone-options-grid">
              {[
                { id: 'fair', label: 'Fair / Porcelaine', hex: '#F9E4D4', desc: 'Burns easily, porcelain undertones' },
                { id: 'light-medium', label: 'Light-Medium / Doré', hex: '#F2D5BD', desc: 'Tans gradually, subtle golden radiance' },
                { id: 'tan', label: 'Tan / Ambre', hex: '#C6946E', desc: 'Tans easily, olive or warm bronze glow' },
                { id: 'deep', label: 'Deep / Ébène', hex: '#875338', desc: 'Rich melanin, never burns' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`tone-card-btn ${skinTone === opt.id ? 'is-selected' : ''}`}
                  onClick={() => setSkinTone(opt.id)}
                >
                  <div className="tone-swatch-circle" style={{ backgroundColor: opt.hex }} />
                  <div className="tone-text-block">
                    <span className="tone-name">{opt.label}</span>
                    <span className="tone-desc">{opt.desc}</span>
                  </div>
                  {skinTone === opt.id && <Check size={16} className="selected-check" />}
                </button>
              ))}
            </div>

            <div className="finder-action-row">
              <EditorialLink
                size="md"
                onClick={() => setStep(2)}
                ariaLabel="Continue to undertone step"
              >
                CONTINUE
              </EditorialLink>
            </div>
          </div>
        )}

        {/* Step 2: Undertone */}
        {step === 2 && (
          <div className="finder-step-body">
            <span className="step-num-tag">STEP 02 OF 03</span>
            <h3 className="step-question font-serif">What is your skin undertone?</h3>
            <p className="step-hint">Look at the veins on the inside of your wrist or how you react to jewelry.</p>

            <div className="tone-options-grid">
              {[
                { id: 'cool', label: 'Cool / Rosé', desc: 'Veins appear blue/purple. Silver jewelry flatters best.' },
                { id: 'neutral', label: 'Neutral / Beige', desc: 'Veins appear blue-green. Both gold and silver flatter.' },
                { id: 'warm', label: 'Warm / Doré', desc: 'Veins appear olive-green. Gold jewelry flatters best.' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`tone-card-btn ${undertone === opt.id ? 'is-selected' : ''}`}
                  onClick={() => setUndertone(opt.id)}
                >
                  <div className="tone-text-block">
                    <span className="tone-name">{opt.label}</span>
                    <span className="tone-desc">{opt.desc}</span>
                  </div>
                  {undertone === opt.id && <Check size={16} className="selected-check" />}
                </button>
              ))}
            </div>

            <div className="finder-action-row split">
              <EditorialLink
                size="sm"
                variant="muted"
                arrowPosition="left"
                onClick={() => setStep(1)}
              >
                BACK
              </EditorialLink>

              <EditorialLink
                size="md"
                onClick={() => setStep(3)}
                ariaLabel="Continue to finish step"
              >
                CONTINUE
              </EditorialLink>
            </div>
          </div>
        )}

        {/* Step 3: Luminous Finish */}
        {step === 3 && (
          <div className="finder-step-body">
            <span className="step-num-tag">STEP 03 OF 03</span>
            <h3 className="step-question font-serif">What luminous finish do you desire?</h3>
            <p className="step-hint">Select how light should reflect off your perfected skin.</p>

            <div className="tone-options-grid">
              {[
                { id: 'dewy', label: 'Luminous Dewy Silk', desc: 'High-bounce glass skin with optical golden hydration.' },
                { id: 'satin', label: 'Satin Velvet Couture', desc: 'Modern soft-focus blur with breathable skin-like texture.' },
                { id: 'matte', label: 'Micro-Aura Velvet', desc: 'Zero shine without dryness. Extended 16h humidity resistance.' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`tone-card-btn ${finish === opt.id ? 'is-selected' : ''}`}
                  onClick={() => setFinish(opt.id)}
                >
                  <div className="tone-text-block">
                    <span className="tone-name">{opt.label}</span>
                    <span className="tone-desc">{opt.desc}</span>
                  </div>
                  {finish === opt.id && <Check size={16} className="selected-check" />}
                </button>
              ))}
            </div>

            <div className="finder-action-row split">
              <EditorialLink
                size="sm"
                variant="muted"
                arrowPosition="left"
                onClick={() => setStep(2)}
              >
                BACK
              </EditorialLink>

              <EditorialLink
                size="md"
                onClick={() => setStep(4)}
                ariaLabel="Reveal bespoke shade match"
              >
                REVEAL MY MATCH
              </EditorialLink>
            </div>
          </div>
        )}

        {/* Step 4: Bespoke Results */}
        {step === 4 && (
          <div className="finder-step-body results-view">
            <div className="results-header">
              <span className="step-num-tag">CONSULTATION COMPLETE</span>
              <h3 className="results-title font-serif">Your Bespoke Luminous Prescription</h3>
              <p className="results-sub">Precision-matched for your skin depth, undertone, and desired light reflection.</p>
            </div>

            <div className="matched-products-row">
              {/* Matched Foundation */}
              <div className="match-card">
                <span className="match-tag">PRIMARY MATCH</span>
                <img src="/images/foundation.jpg" alt="Foundation" className="match-img" />
                <h4 className="font-serif match-name">Fond de Teint Soie Pure</h4>
                <div className="match-shade-pill" style={{ borderColor: matchedFoundationShade.hex }}>
                  <span className="shade-dot" style={{ backgroundColor: matchedFoundationShade.hex }} />
                  <span>{matchedFoundationShade.name}</span>
                </div>
                <p className="match-desc">{matchedFoundationShade.description}</p>
                <span className="match-price font-serif">$140</span>
              </div>

              {/* Matched Lip Velvet */}
              {matchedLipShade && (
                <div className="match-card">
                  <span className="match-tag">COUTURE PAIRING</span>
                  <img src="/images/lipstick.jpg" alt="Lip Velvet" className="match-img" />
                  <h4 className="font-serif match-name">Aurore Lip Velvet Couture</h4>
                  <div className="match-shade-pill" style={{ borderColor: matchedLipShade.hex }}>
                    <span className="shade-dot" style={{ backgroundColor: matchedLipShade.hex }} />
                    <span>{matchedLipShade.name}</span>
                  </div>
                  <p className="match-desc">{matchedLipShade.description}</p>
                  <span className="match-price font-serif">$68</span>
                </div>
              )}
            </div>

            <div className="finder-action-row split">
              <EditorialLink
                size="sm"
                variant="muted"
                arrowPosition="left"
                onClick={handleReset}
              >
                RETAKE
              </EditorialLink>

              <EditorialLink
                size="md"
                onClick={handleAddBespokePair}
                className={isAdded ? 'product-added-link' : ''}
              >
                {isAdded ? 'ADDED BESPOKE DUO' : 'ADD BESPOKE DUO TO BAG ($208)'}
              </EditorialLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
