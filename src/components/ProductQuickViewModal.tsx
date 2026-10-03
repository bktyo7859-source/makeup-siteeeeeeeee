import React, { useState } from 'react';
import { Product, Shade } from '../types';
import { X, Star, Plus, Minus, Sparkles, ShieldCheck } from 'lucide-react';
import { EditorialLink } from './EditorialLink';
import './ProductQuickViewModal.css';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, shade?: Shade, quantity?: number) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  if (!product) return null;

  const [selectedShade, setSelectedShade] = useState<Shade | undefined>(
    product.shades ? product.shades[0] : undefined
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const handleAdd = () => {
    onAddToCart(product, selectedShade, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="quickview-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="quickview-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="quickview-close-btn" onClick={onClose} aria-label="Close product view">
          <X size={20} />
        </button>

        <div className="quickview-layout">
          {/* Left image column */}
          <div className="quickview-image-col">
            <img src={product.image} alt={product.name} className="quickview-main-img" />
            {product.badge && <span className="quickview-badge">{product.badge}</span>}
          </div>

          {/* Right details column */}
          <div className="quickview-details-col">
            <div className="quickview-meta-top">
              <span className="quickview-category">{product.ritualStep}</span>
              <div className="quickview-rating">
                <Star size={14} className="fill-gold" />
                <span>{product.rating} ({product.reviewsCount} verified reviews)</span>
              </div>
            </div>

            <h2 className="quickview-title font-serif">{product.name}</h2>
            <p className="quickview-french-sub">{product.frenchSubtitle}</p>
            <p className="quickview-tagline">{product.tagline}</p>

            <div className="quickview-price-row">
              <span className="quickview-price font-serif">${product.price}</span>
              {product.originalPrice && (
                <span className="quickview-original-price">${product.originalPrice}</span>
              )}
            </div>

            <div className="gold-hairline" />

            <p className="quickview-description">{product.description}</p>

            {/* Key Benefits */}
            <div className="quickview-benefits-list">
              <span className="benefits-title">HAUTE PERFORMANCE BENEFITS:</span>
              <ul>
                {product.benefits.map((b, i) => (
                  <li key={i}>
                    <Sparkles size={12} className="benefit-icon" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Shade Selector */}
            {product.shades && product.shades.length > 0 && (
              <div className="quickview-shade-selector">
                <div className="shade-header-row">
                  <span className="shade-title">SELECT COUTURE SHADE:</span>
                  <span className="shade-active-name">{selectedShade?.name}</span>
                </div>
                <div className="shade-swatch-list">
                  {product.shades.map((shade) => (
                    <button
                      key={shade.id}
                      type="button"
                      className={`quick-swatch ${selectedShade?.id === shade.id ? 'is-selected' : ''}`}
                      style={{ backgroundColor: shade.hex }}
                      onClick={() => setSelectedShade(shade)}
                      aria-label={shade.name}
                      title={`${shade.name} - ${shade.description}`}
                    />
                  ))}
                </div>
                <span className="shade-desc-hint">{selectedShade?.description}</span>
              </div>
            )}

            {/* Key Active Ingredients */}
            <div className="quickview-ingredients-pill-row">
              {product.keyIngredients.map((ing, i) => (
                <span key={i} className="ingredient-tag">{ing}</span>
              ))}
            </div>

            {/* Quantity & Add to Bag */}
            <div className="quickview-purchase-actions">
              <div className="quantity-stepper">
                <button
                  type="button"
                  className="step-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="quantity-val">{quantity}</span>
                <button
                  type="button"
                  className="step-btn"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              <EditorialLink
                size="lg"
                onClick={handleAdd}
                className={isAdded ? 'product-added-link' : ''}
                ariaLabel={`Add ${quantity} of ${product.name} to bag`}
              >
                {isAdded ? 'ADDED TO BAG' : `ADD TO BAG • $${(product.price * quantity).toFixed(0)}`}
              </EditorialLink>
            </div>

            <div className="quickview-guarantee-row">
              <ShieldCheck size={14} className="guar-icon" />
              <span>Complimentary Returns • 100% Satisfaction Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
