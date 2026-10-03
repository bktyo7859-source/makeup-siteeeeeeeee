import React, { useState } from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { EditorialLink } from './EditorialLink';
import './EditorialLookbook.css';

export const EditorialLookbook: React.FC = () => {
  const [activeLook, setActiveLook] = useState<number>(0);

  const looks = [
    {
      title: 'L\'Or Doré • Golden Hour Glow',
      season: 'Campaign 2026 // Paris Fashion Week',
      description: 'Sculpted cheekbones with dewy silk foundation and a sheer touch of 24K cellular nectar oil under ambient sunset light.',
      productsUsed: ['Fond de Teint Soie Pure (20W)', 'L\'Élixir Sublime Lumière', 'Baume Nude Palais'],
      shadeNote: 'Dewy High-Bounce Reflection'
    },
    {
      title: 'Velours Rose • Parisian Velvet',
      season: 'Haute Couture Editorial',
      description: 'Soft-focus cloud matte complexion paired with a velvety blurred rose lip and satin luminous eyelids.',
      productsUsed: ['Fond de Teint Soie Pure (30C)', 'Crème Regenerative Aura', 'Aurore Lip Velvet 01'],
      shadeNote: 'Soft-Focus Satin Diffusion'
    },
    {
      title: 'Noir Éclat • Midnight Luminescence',
      season: 'The Nocturne Collection',
      description: 'High-contrast architectural beauty with deep berry couture lips and optical light-reflecting glass skin.',
      productsUsed: ['Fond de Teint Soie Pure (10N & 50W)', 'Aurore Lip Velvet 02', 'L\'Élixir Sublime'],
      shadeNote: 'High-Contrast Couture Contrast'
    }
  ];

  return (
    <section id="lookbook-section" className="lookbook-section" aria-label="Haute Editorial Lookbook">
      <div className="lookbook-container">
        <div className="lookbook-header">
          <span className="editorial-sub">EDITORIAL ARCHIVE</span>
          <h2 className="lookbook-title font-serif">
            The Haute Couture <br />
            <span className="italic-accent">Beauty Lookbook</span>
          </h2>
          <p className="lookbook-sub">
            Curated runway aesthetics engineered with optical light reflection formulas.
          </p>
        </div>

        {/* Lookbook interactive display */}
        <div className="lookbook-matrix">
          <div className="look-tabs-col">
            {looks.map((look, idx) => (
              <div
                key={look.title}
                className={`look-tab-card ${activeLook === idx ? 'is-selected' : ''}`}
                onClick={() => setActiveLook(idx)}
              >
                <div className="look-tab-header">
                  <span className="look-season">{look.season}</span>
                  <ArrowUpRight size={16} className="look-arrow" />
                </div>
                <h3 className="look-title font-serif">{look.title}</h3>
                <p className="look-desc">{look.description}</p>
                <div className="look-shade-badge">
                  <Sparkles size={12} />
                  <span>{look.shadeNote}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="look-preview-col">
            <div className="look-active-card">
              <span className="look-badge-top">PARIS EDITORIAL SPOTLIGHT</span>
              <h3 className="look-hero-name font-serif">{looks[activeLook].title}</h3>
              <p className="look-hero-desc">{looks[activeLook].description}</p>
              
              <div className="products-used-box">
                <span className="products-used-title">FORMULATIONS UTILIZED IN THIS LOOK:</span>
                <ul>
                  {looks[activeLook].productsUsed.map((p, i) => (
                    <li key={i}>
                      <span className="bullet-dot" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="look-cta-row">
                <EditorialLink href="#collection-section" size="md">
                  SHOP THIS LOOK
                </EditorialLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
