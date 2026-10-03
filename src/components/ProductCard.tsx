import React, { useState } from 'react';
import { Product, Shade } from '../types';
import { Star } from 'lucide-react';
import { EditorialLink } from './EditorialLink';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, shade?: Shade) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView
}) => {
  const [selectedShade, setSelectedShade] = useState<Shade | undefined>(
    product.shades ? product.shades[0] : undefined
  );
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const handleAdd = () => {
    onAddToCart(product, selectedShade);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <article className="luxury-product-card" aria-label={product.name}>
      {/* Product Image Container */}
      <div className="product-image-frame" onClick={() => onQuickView(product)}>
        {product.badge && <span className="product-luxury-badge">{product.badge}</span>}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="product-img"
        />
        
        {/* Hover Quick Actions */}
        <div className="product-card-overlay">
          <EditorialLink
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            ariaLabel={`Quick view ${product.name}`}
            className="product-quick-view-link"
          >
            QUICK VIEW
          </EditorialLink>
        </div>
      </div>

      {/* Product Meta */}
      <div className="product-card-info">
        <div className="product-card-header">
          <span className="product-ritual-tag">{product.ritualStep}</span>
          <div className="product-rating" aria-label={`Rated ${product.rating} stars`}>
            <Star size={12} className="star-icon fill-red" />
            <span className="rating-score">{product.rating}</span>
            <span className="reviews-count">({product.reviewsCount})</span>
          </div>
        </div>

        <h3
          className="product-card-title font-serif"
          onClick={() => onQuickView(product)}
          style={{ cursor: 'pointer' }}
        >
          {product.name}
        </h3>
        <p className="product-card-subtitle">{product.frenchSubtitle}</p>
        <p className="product-card-tagline">{product.tagline}</p>

        {/* Shade Swatch Selector if applicable */}
        {product.shades && product.shades.length > 0 && (
          <div className="shade-swatch-cluster" aria-label="Select shade">
            <span className="shade-current-label">
              Shade: <strong>{selectedShade?.name}</strong>
            </span>
            <div className="swatch-dots-row">
              {product.shades.map((shade) => (
                <button
                  key={shade.id}
                  type="button"
                  className={`swatch-circle ${selectedShade?.id === shade.id ? 'is-active' : ''}`}
                  style={{ backgroundColor: shade.hex }}
                  onClick={() => setSelectedShade(shade)}
                  aria-label={shade.name}
                  title={`${shade.name} - ${shade.description}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Price & Add to Bag (Text-Only Editorial CTA) */}
        <div className="product-purchase-row">
          <div className="price-block">
            <span className="price-main font-serif">${product.price}</span>
            {product.originalPrice && (
              <span className="price-original">${product.originalPrice}</span>
            )}
          </div>

          <EditorialLink
            size="sm"
            onClick={handleAdd}
            ariaLabel={`Add ${product.name} to bag`}
            className={isAdded ? 'product-added-link' : ''}
          >
            {isAdded ? 'ADDED' : 'ADD TO BAG'}
          </EditorialLink>
        </div>
      </div>
    </article>
  );
};
