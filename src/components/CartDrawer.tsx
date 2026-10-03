import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, ShoppingBag, Sparkles, CheckCircle2 } from 'lucide-react';
import { EditorialLink } from './EditorialLink';
import './CartDrawer.css';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  const [promoCode, setPromoCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [promoApplied, setPromoApplied] = useState<boolean>(false);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [orderComplete, setOrderComplete] = useState<boolean>(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const shipping = subtotal > 150 ? 0 : 15;
  const total = Math.max(0, subtotal - discountAmount + (items.length > 0 ? shipping : 0));

  // Progress to complimentary gift ($150 target)
  const giftThreshold = 150;
  const giftProgress = Math.min(100, (subtotal / giftThreshold) * 100);
  const amountNeededForGift = Math.max(0, giftThreshold - subtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'LUMIERE15' || promoCode.trim().toUpperCase() === 'HAUTE15') {
      setDiscountPercent(15);
      setPromoApplied(true);
    } else {
      alert('Invalid promo code. Try LUMIERE15 for 15% off.');
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
    }, 1200);
  };

  const handleCloseOrder = () => {
    setOrderComplete(false);
    onClearCart();
    onClose();
  };

  return (
    <div className="cart-drawer-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div className="cart-header-title-block">
            <ShoppingBag size={18} className="cart-header-icon" />
            <h3 className="cart-drawer-title font-serif">Votre Panier Haute Beauté</h3>
            <span className="cart-items-count">({items.reduce((a, b) => a + b.quantity, 0)})</span>
          </div>
          <button type="button" className="cart-close-btn" onClick={onClose} aria-label="Close cart drawer">
            <X size={20} />
          </button>
        </div>

        {/* Order Completion Screen */}
        {orderComplete ? (
          <div className="order-complete-view">
            <CheckCircle2 size={54} className="order-success-icon" />
            <span className="editorial-sub">MERCI BEAUCOUP</span>
            <h2 className="order-success-title font-serif">Your Haute Order Is Confirmed</h2>
            <p className="order-success-desc">
              Your bespoke formulations are being delicately prepared in our Parisian atelier with complimentary gift wrapping.
            </p>
            <div className="order-receipt-card">
              <span className="receipt-order-id">ORDER #ML-2026-98412</span>
              <span className="receipt-amount font-serif">${total.toFixed(2)} USD</span>
            </div>
            <EditorialLink size="md" onClick={handleCloseOrder}>
              CONTINUE EXPLORING
            </EditorialLink>
          </div>
        ) : (
          <>
            {/* Free Miniature Gift Progress Bar */}
            <div className="free-gift-meter">
              <div className="meter-label-row">
                <Sparkles size={13} className="meter-sparkle" />
                <span className="meter-text">
                  {amountNeededForGift > 0 ? (
                    <>Add <strong>${amountNeededForGift.toFixed(0)}</strong> for a Complimentary Haute Miniature</>
                  ) : (
                    <>✨ <strong>Complimentary Haute Miniature Unlocked!</strong></>
                  )}
                </span>
              </div>
              <div className="meter-track">
                <div className="meter-fill" style={{ width: `${giftProgress}%` }} />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="cart-items-container">
              {items.length === 0 ? (
                <div className="cart-empty-view">
                  <ShoppingBag size={48} className="empty-cart-icon" />
                  <p className="empty-title font-serif">Your shopping bag is empty</p>
                  <p className="empty-sub">Discover our cellular elixirs and silk foundations to elevate your ritual.</p>
                  <EditorialLink size="md" onClick={onClose}>
                    DISCOVER COLLECTION
                  </EditorialLink>
                </div>
              ) : (
                items.map((item, idx) => (
                  <div key={`${item.product.id}-${item.selectedShade?.id || 'none'}-${idx}`} className="cart-item-row">
                    <img src={item.product.image} alt={item.product.name} className="cart-item-img" />
                    
                    <div className="cart-item-info">
                      <h3 className="cart-item-title font-serif">{item.product.name}</h3>
                      {item.selectedShade && (
                        <div className="cart-item-shade-tag">
                          <span className="cart-shade-swatch" style={{ backgroundColor: item.selectedShade.hex }} />
                          <span>{item.selectedShade.name}</span>
                        </div>
                      )}
                      <span className="cart-item-price font-serif">${item.product.price}</span>

                      <div className="cart-item-controls">
                        <div className="cart-qty-stepper">
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="qty-num">{item.quantity}</span>
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          type="button"
                          className="cart-remove-btn"
                          onClick={() => onRemoveItem(idx)}
                          aria-label={`Remove ${item.product.name} from bag`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer / Checkout */}
            {items.length > 0 && (
              <div className="cart-drawer-footer">
                {/* Promo code input */}
                <form className="promo-code-form" onSubmit={handleApplyPromo}>
                  <input
                    type="text"
                    placeholder="Enter Promo Code (e.g. LUMIERE15)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="promo-input"
                  />
                  <EditorialLink size="sm" type="submit" showArrow={false}>
                    APPLY
                  </EditorialLink>
                </form>

                {promoApplied && (
                  <div className="promo-applied-badge">
                    <Sparkles size={12} />
                    <span>Promo Applied: 15% Haute Privilege Discount</span>
                  </div>
                )}

                {/* Subtotals breakdown */}
                <div className="cart-totals-breakdown">
                  <div className="total-row">
                    <span>Subtotal</span>
                    <span className="font-serif">${subtotal.toFixed(2)}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="total-row discount">
                      <span>Privilege Discount ({discountPercent}%)</span>
                      <span className="font-serif">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="total-row">
                    <span>Express Worldwide Shipping</span>
                    <span>{shipping === 0 ? 'COMPLIMENTARY' : `$${shipping}.00`}</span>
                  </div>
                  <div className="red-hairline" />
                  <div className="total-row final-total">
                    <span className="final-label">Estimated Total</span>
                    <span className="final-amount font-serif">${total.toFixed(2)} USD</span>
                  </div>
                </div>

                <div className="checkout-action-wrap">
                  <EditorialLink
                    id="checkout-btn"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="checkout-editorial-link"
                  >
                    {isCheckingOut ? 'SECURING HAUTE ORDER...' : 'PROCEED TO SECURE CHECKOUT'}
                  </EditorialLink>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
