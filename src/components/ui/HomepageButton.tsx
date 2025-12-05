import React from 'react';
import { Link } from 'react-router-dom';

interface HomepageButtonProps {
  children: React.ReactNode;
  href?: string;
  to?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
}

export const HomepageButton: React.FC<HomepageButtonProps> = ({
  children,
  href,
  to,
  onClick,
  variant = 'primary',
  size = 'lg',
  className = '',
  style = {},
  type = 'button',
}) => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
    ...style,
  };

  const variantStyles = {
    primary: {
      backgroundColor: '#2563eb',
      color: '#ffffff',
      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
    },
    secondary: {
      backgroundColor: 'transparent',
      color: '#2563eb',
      border: '2px solid #2563eb',
    },
  };

  const sizeStyles = {
    sm: {
      padding: '0.625rem 1.5rem',
      fontSize: '0.875rem',
      borderRadius: '0.5rem',
    },
    md: {
      padding: '0.875rem 2rem',
      fontSize: '1rem',
      borderRadius: '0.5rem',
    },
    lg: {
      padding: '1rem 2.5rem',
      fontSize: '1.125rem',
      borderRadius: '0.75rem',
    },
  };

  const combinedStyles: React.CSSProperties = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
  };

  const buttonId = React.useMemo(() => `homepage-btn-${Math.random().toString(36).substr(2, 9)}`, []);
  
  const hoverStyles = React.useMemo(() => `
    #${buttonId}:hover {
      ${variant === 'primary' 
        ? `
          background-color: #1d4ed8 !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4) !important;
          color: #ffffff !important;
        `
        : `
          background-color: #eff6ff !important;
          color: #1d4ed8 !important;
          border-color: #1d4ed8 !important;
        `
      }
    }
  `, [buttonId, variant]);

  if (to) {
    return (
      <>
        <style>{hoverStyles}</style>
        <Link to={to} id={buttonId} className={className} onClick={onClick} style={combinedStyles}>
          {children}
        </Link>
      </>
    );
  }

  if (href) {
    return (
      <>
        <style>{hoverStyles}</style>
        <a href={href} id={buttonId} className={className} onClick={onClick} style={combinedStyles}>
          {children}
        </a>
      </>
    );
  }

  return (
    <>
      <style>{hoverStyles}</style>
      <button type={type} id={buttonId} className={className} onClick={onClick} style={combinedStyles}>
        {children}
      </button>
    </>
  );
};

