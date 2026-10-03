import React, { useState } from 'react';
import { Sparkles, Shield, Droplets, Zap } from 'lucide-react';
import './FormulationRitual.css';

export const FormulationRitual: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      number: '01',
      title: 'Awaken with L\'Élixir Cellular',
      subtitle: 'Pure Bio-Botanical Nectar',
      description: 'Apply 3 warm drops of cold-pressed White Camellia Seed oil and Bakuchiol to initiate cellular micro-circulation. Creates immediate glass skin light bounce.',
      stats: '+42% Cellular Radiance in 3 mins',
      icon: Droplets,
      formula: 'Rare Camellia • Bakuchiol • Ferulic Acid'
    },
    {
      number: '02',
      title: 'Nourish & Sculpt with Crème 24K',
      subtitle: 'Biomimetic Lipid Matrix',
      description: 'Sculpt cheekbones and jawline using upward strokes. Snow Algae bio-complex reinforces the epidermal lipid barrier and locks in moisture for 72 hours.',
      stats: '72H Continuous Barrier Hydration',
      icon: Shield,
      formula: 'Snow Algae • Triple Ceramides • 24K Gold'
    },
    {
      number: '03',
      title: 'Illuminate with Fond de Teint Soie',
      subtitle: 'Micro-Silk Second Skin',
      description: 'Buff foundation outward from face center. Optical light-scattering crystals harmonize with your skin tone to erase micro-texture without masking your natural radiance.',
      stats: '16H Weightless Breathable Wear',
      icon: Zap,
      formula: 'Silk Protein • Alpine Edelweiss • SPF 25'
    },
    {
      number: '04',
      title: 'Accentuate with Lip Velvet Couture',
      subtitle: 'Nectar Glaze Finish',
      description: 'Glide rich Parisian rose pigment across lips. Hyaluronic micro-reservoirs plump and preserve hydration throughout the day in a luxurious fluted gold talisman.',
      stats: '100% Satin Comfort • Non-Drying',
      icon: Sparkles,
      formula: 'French Rose Wax • Mango Butter • Hyaluronic Acid'
    }
  ];

  return (
    <section id="ritual-section" className="ritual-section" aria-label="The 4-Step Formulation Ritual">
      <div className="ritual-container">
        {/* Header */}
        <div className="ritual-header">
          <span className="editorial-sub">CLINICAL CELLULAR SCIENCE</span>
          <h2 className="ritual-title font-serif">
            The 4-Step Haute <br />
            <span className="italic-accent">Illumination Ritual</span>
          </h2>
          <p className="ritual-desc">
            A harmonized synergy of botanical bioactive elixirs and optical reflection technology, 
            designed to sculpt the natural architecture of your face.
          </p>
        </div>

        {/* Interactive Steps Matrix */}
        <div className="ritual-interactive-grid">
          {/* Left step tabs */}
          <div className="ritual-steps-nav" role="tablist">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <button
                  key={step.number}
                  role="tab"
                  aria-selected={activeStep === idx}
                  className={`ritual-nav-card ${activeStep === idx ? 'is-active' : ''}`}
                  onClick={() => setActiveStep(idx)}
                >
                  <div className="step-badge-col">
                    <span className="step-num-big font-serif">{step.number}</span>
                    <Icon size={18} className="step-icon-accent" />
                  </div>
                  <div className="step-text-col">
                    <h4 className="step-card-title">{step.title}</h4>
                    <span className="step-card-sub">{step.subtitle}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right active step spotlight showcase */}
          <div className="ritual-spotlight-display">
            <div className="spotlight-glass-panel">
              <div className="spotlight-top-meta">
                <span className="spotlight-step-tag">RITUAL PHASE {steps[activeStep].number}</span>
                <span className="spotlight-formula">{steps[activeStep].formula}</span>
              </div>

              <h3 className="spotlight-title font-serif">{steps[activeStep].title}</h3>
              <p className="spotlight-body">{steps[activeStep].description}</p>

              <div className="spotlight-stat-banner">
                <Sparkles size={18} className="stat-sparkle" />
                <span className="stat-highlight">{steps[activeStep].stats}</span>
              </div>

              <div className="spotlight-assurance-row">
                <span>✓ 100% Bio-Compatible</span>
                <span>✓ Non-Comedogenic</span>
                <span>✓ Vegan & Cruelty-Free</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
