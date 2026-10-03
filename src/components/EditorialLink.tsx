import React from 'react';
import './EditorialLink.css';

export interface EditorialLinkProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
  className?: string;
  id?: string;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
  showArrow?: boolean;
  arrowPosition?: 'right' | 'left';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'muted' | 'subtle';
  disabled?: boolean;
  target?: string;
  rel?: string;
}

export const EditorialLink: React.FC<EditorialLinkProps> = ({
  children,
  onClick,
  href,
  className = '',
  id,
  type = 'button',
  ariaLabel,
  showArrow = true,
  arrowPosition = 'right',
  size = 'md',
  variant = 'primary',
  disabled = false,
  target,
  rel,
}) => {
  const combinedClassName = `editorial-link size-${size} variant-${variant} ${className}`.trim();

  const arrowElement = showArrow ? (
    <span className="editorial-arrow" aria-hidden="true">
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </span>
  ) : null;

  if (href) {
    return (
      <a
        href={href}
        id={id}
        className={combinedClassName}
        onClick={onClick}
        aria-label={ariaLabel}
        target={target}
        rel={rel}
      >
        {arrowPosition === 'left' && arrowElement}
        <span className="editorial-link-text">{children}</span>
        {arrowPosition === 'right' && arrowElement}
      </a>
    );
  }

  return (
    <button
      type={type}
      id={id}
      className={combinedClassName}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {arrowPosition === 'left' && arrowElement}
      <span className="editorial-link-text">{children}</span>
      {arrowPosition === 'right' && arrowElement}
    </button>
  );
};
