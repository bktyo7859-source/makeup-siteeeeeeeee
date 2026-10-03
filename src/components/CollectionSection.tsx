import React, { useState } from 'react';
import { Product, Shade } from '../types';
import { ProductCard } from './ProductCard';
import { Sparkles, SlidersHorizontal } from 'lucide-react';
import './CollectionSection.css';

interface CollectionSectionProps {
  products: Product[];
  onAddToCart: (product: Product, shade?: Shade) => void;
  onQuickView: (product: Product) => void;
}

export const CollectionSection: React.FC<CollectionSectionProps> = ({
  products,
  onAddToCart,
  onQuickView
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Formulations' },
    { id: 'complexion', label: 'Luminous Complexion' },
    { id: 'serum', label: 'Cellular Elixirs' },
    { id: 'cream', label: 'Sculpting Crèmes' },
    { id: 'lips', label: 'Couture Lips' }
  ];

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <section id="collection-section" className="collection-section" aria-label="Haute Skincare and Beauty Collection">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header-block">
          <div className="section-tag">
            <Sparkles size={14} className="tag-icon" />
            <span>THE SIGNATURE FORMULATIONS</span>
          </div>

          <h2 className="section-title font-serif">
            Formulated for Light Reflection. <br />
            <span className="italic-accent">Engineered for Transformation.</span>
          </h2>

          <p className="section-subtitle">
            Every bottle is an architectural blend of French botanical active extracts, biomimetic lipids, 
            and optical light-diffusing crystals designed to awaken your inner luminescence.
          </p>

          {/* Category Filter Tabs */}
          <div className="category-filter-bar" role="tablist" aria-label="Product categories">
            {categories.map((cat) => (
              <button
                key={cat.id}
                role="tab"
                aria-selected={activeCategory === cat.id}
                className={`category-tab-btn ${activeCategory === cat.id ? 'is-selected' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
            />
          ))}
        </div>

        {/* Bottom Banner Feature */}
        <div className="collection-haute-promise">
          <div className="promise-item">
            <SlidersHorizontal size={18} className="promise-icon" />
            <div className="promise-text">
              <h4>Bespoke Clinical Formulations</h4>
              <p>100% Dermatologist approved for sensitive & radiant skin types.</p>
            </div>
          </div>
          <div className="promise-divider" />
          <div className="promise-item">
            <Sparkles size={18} className="promise-icon" />
            <div className="promise-text">
              <h4>24K Bio-Peptide Infusion</h4>
              <p>Optical light bounce with cellular restorative elasticity.</p>
            </div>
          </div>
          <div className="promise-divider" />
          <div className="promise-item">
            <span className="promise-badge">FR</span>
            <div className="promise-text">
              <h4>Handcrafted in Grasse, France</h4>
              <p>Sustainable glass packaging with refillable talismans.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
