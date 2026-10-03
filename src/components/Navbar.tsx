import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Heart, Menu, X, Sparkles } from 'lucide-react';
import './Navbar.css';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenShadeFinder: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenShadeFinder,
  onNavigateSection
}) => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onNavigateSection(sectionId);
  };

  return (
    <>
      {/* Top Luxury Announcement Bar */}
      <div className="announcement-bar">
        <div className="announcement-content">
          <Sparkles size={12} className="announcement-icon" />
          <span>COMPLIMENTARY HAUTE MINIATURE WITH ORDERS OVER $150 • FREE WORLDWIDE EXPRESS DELIVERY</span>
          <Sparkles size={12} className="announcement-icon" />
        </div>
      </div>

      {/* Main Luxury Header */}
      <header className={`maison-header ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="header-container">
          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="header-icon-btn mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Left Navigation Links */}
          <nav className="desktop-nav left-nav" aria-label="Main Navigation">
            <button type="button" className="nav-link" onClick={() => handleNavClick('collection-section')}>
              Collection
            </button>
            <button type="button" className="nav-link" onClick={() => handleNavClick('ritual-section')}>
              The Science
            </button>
            <button type="button" className="nav-link highlight-link" onClick={onOpenShadeFinder}>
              <span>Shade Finder</span>
              <span className="nav-badge">AI</span>
            </button>
          </nav>

          {/* Central Luxury Maison Logo */}
          <a href="#" className="maison-logo-link" aria-label="Maison Lumière Home">
            <span className="logo-sub">PARIS</span>
            <span className="logo-main font-serif">MAISON LUMIÈRE</span>
            <span className="logo-tag">HAUTE BEAUTÉ</span>
          </a>

          {/* Right Navigation & Utility Actions */}
          <div className="header-utilities">
            <button
              type="button"
              className="nav-link desktop-only"
              onClick={() => handleNavClick('lookbook-section')}
            >
              Lookbook
            </button>

            {/* Search Toggle */}
            <button
              type="button"
              id="search-toggle-btn"
              className="header-icon-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search luxury products"
            >
              <Search size={18} />
            </button>

            {/* Wishlist */}
            <button
              type="button"
              className="header-icon-btn desktop-only"
              aria-label="View wishlist"
            >
              <Heart size={18} />
            </button>

            {/* Luxury Shopping Bag */}
            <button
              type="button"
              id="cart-drawer-trigger"
              className="header-icon-btn bag-trigger-btn"
              onClick={onOpenCart}
              aria-label={`Shopping bag containing ${cartCount} items`}
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && <span className="bag-count-badge">{cartCount}</span>}
            </button>
          </div>
        </div>

        {/* Expandable Luxury Search Overlay */}
        {searchOpen && (
          <div className="header-search-bar" role="search">
            <div className="search-input-wrapper">
              <Search size={18} className="search-input-icon" />
              <input
                type="text"
                placeholder="Search formulations, ingredients, or shades..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="search-input"
              />
              <button
                type="button"
                className="search-close-btn"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-nav-backdrop" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-nav-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-nav-header">
              <span className="mobile-nav-logo font-serif">MAISON LUMIÈRE</span>
              <button
                type="button"
                className="header-icon-btn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mobile-nav-links">
              <button type="button" className="mobile-link" onClick={() => handleNavClick('collection-section')}>
                Signature Collection
              </button>
              <button type="button" className="mobile-link" onClick={() => handleNavClick('ritual-section')}>
                The 4-Step Formulation Ritual
              </button>
              <button
                type="button"
                className="mobile-link highlight"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenShadeFinder();
                }}
              >
                Bespoke Shade & Tone Finder ✨
              </button>
              <button type="button" className="mobile-link" onClick={() => handleNavClick('lookbook-section')}>
                Haute Editorial Lookbook
              </button>
              <button type="button" className="mobile-link" onClick={() => handleNavClick('press-section')}>
                Press & Accolades
              </button>
            </div>

            <div className="mobile-nav-footer">
              <p className="mobile-footer-text">PARIS • 24 PLACE VENDÔME</p>
              <p className="mobile-footer-sub">Haute Beauté & Bio-Cellular Formulations</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
