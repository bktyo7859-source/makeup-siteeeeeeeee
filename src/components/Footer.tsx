import React, { useState } from 'react';
import { Shield, Globe, Award, Check } from 'lucide-react';
import { EditorialLink } from './EditorialLink';
import './Footer.css';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('@')) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="maison-footer" role="contentinfo">
      {/* Newsletter / VIP Invitation */}
      <div className="footer-newsletter-block">
        <div className="newsletter-container">
          <div className="newsletter-text">
            <span className="editorial-sub">HAUTE PRIVILÈGE CLUB</span>
            <h3 className="newsletter-title font-serif">
              An Invitation to Pure Luminescence
            </h3>
            <p className="newsletter-desc">
              Receive private atelier invitations, bespoke formulation releases, and complimentary deluxe miniatures.
            </p>
          </div>

          <form className="newsletter-form" onSubmit={handleSubscribe}>
            {isSubscribed ? (
              <div className="subscribed-success">
                <Check size={18} />
                <span>Bienvenue. Your private invitation has been dispatched.</span>
              </div>
            ) : (
              <div className="newsletter-input-group">
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="newsletter-input"
                  aria-label="Email address for VIP newsletter"
                />
                <EditorialLink
                  type="submit"
                  size="md"
                  className="newsletter-submit-link"
                  ariaLabel="Join Atelier VIP membership"
                >
                  JOIN ATELIER
                </EditorialLink>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="footer-main-grid">
        <div className="footer-col brand-col">
          <span className="footer-logo font-serif">MAISON LUMIÈRE</span>
          <span className="footer-tagline">HAUTE BEAUTÉ & BIO-CELLULAR SCIENCE</span>
          <p className="footer-bio">
            Founded in Paris. Formulating at the intersection of rare French bio-botanicals, 
            biomimetic ceramides, and light-refracting crystal architecture.
          </p>
          <div className="footer-badges-row">
            <div className="footer-badge-pill">
              <Shield size={12} />
              <span>Cruelty Free</span>
            </div>
            <div className="footer-badge-pill">
              <Globe size={12} />
              <span>Eco-Refillable</span>
            </div>
            <div className="footer-badge-pill">
              <Award size={12} />
              <span>Grasse Certified</span>
            </div>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">THE FORMULATIONS</h4>
          <ul className="footer-link-list">
            <li><a href="#collection-section">L'Élixir Sublime Lumière</a></li>
            <li><a href="#collection-section">Fond de Teint Soie Pure</a></li>
            <li><a href="#collection-section">Crème Regenerative 24K</a></li>
            <li><a href="#collection-section">Aurore Lip Velvet Couture</a></li>
            <li><a href="#collection-section">The Complete 4-Step Set</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">BESPOKE SERVICES</h4>
          <ul className="footer-link-list">
            <li><a href="#hero-section">Interactive Face Light Study</a></li>
            <li><a href="#collection-section">Virtual Shade Consultation</a></li>
            <li><a href="#">Bespoke Engraving Atelier</a></li>
            <li><a href="#">Complimentary Deluxe Sampling</a></li>
            <li><a href="#">Private Beauty Concierge</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">FLAGSHIP ATELIERS</h4>
          <p className="boutique-address">
            <strong>PARIS</strong><br />
            24 Place Vendôme, 75001 Paris
          </p>
          <p className="boutique-address">
            <strong>NEW YORK</strong><br />
            740 Madison Avenue, NY 10065
          </p>
          <p className="boutique-address">
            <strong>TOKYO</strong><br />
            Ginza 6-Chome, Chuo-ku, Tokyo
          </p>
        </div>
      </div>

      {/* Bottom Legal Copyright */}
      <div className="footer-bottom-bar">
        <p className="copyright-text">
          © 2026 MAISON LUMIÈRE PARIS. ALL RIGHTS RESERVED. HAUTE BEAUTÉ LABORATOIRES.
        </p>
        <div className="footer-legal-links">
          <a href="#">Privacy Policy</a>
          <span>•</span>
          <a href="#">Terms of Haute Service</a>
          <span>•</span>
          <a href="#">Accessibility</a>
          <span>•</span>
          <a href="#">Ethical Sourcing Pledge</a>
        </div>
      </div>
    </footer>
  );
};
