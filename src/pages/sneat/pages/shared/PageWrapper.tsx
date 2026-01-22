import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

// Consistent color palette - subtle, professional
export const colors = {
  // Primary - Soft indigo/blue
  primary: '#5c6bc0',
  primaryLight: '#e8eaf6',
  primaryDark: '#3f51b5',

  // Text colors
  textPrimary: '#37474f',
  textSecondary: '#78909c',
  textMuted: '#b0bec5',

  // Background colors
  bgWhite: '#ffffff',
  bgLight: '#fafbfc',
  bgCard: '#ffffff',
  bgHover: '#f5f7fa',

  // Border colors
  border: '#e8ecef',
  borderLight: '#f0f3f5',

  // Status colors - muted versions
  success: '#66bb6a',
  successLight: '#e8f5e9',
  warning: '#ffb74d',
  warningLight: '#fff8e1',
  error: '#ef5350',
  errorLight: '#ffebee',
  info: '#42a5f5',
  infoLight: '#e3f2fd'
};

// Breakpoint-aware container with proper max-widths
export const PageWrapper: React.FC<PageWrapperProps> = ({ children, className = '' }) => {
  return (
    <div
      className={className}
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '16px 16px 32px',
        minHeight: '100%'
      }}
    >
      {children}
    </div>
  );
};

// Card component with consistent styling
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = false
}) => {
  const paddingClasses = {
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-5 lg:p-6',
    lg: 'p-5 sm:p-6 lg:p-8'
  };

  return (
    <div
      className={`bg-white rounded-lg ${paddingClasses[padding]} ${hover ? 'hover:shadow-md transition-shadow cursor-pointer' : ''} ${className}`}
      style={{
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        border: `1px solid ${colors.borderLight}`
      }}
    >
      {children}
    </div>
  );
};

// Section title component
interface SectionTitleProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, action }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-6">
      <div>
        <h2
          className="text-lg sm:text-xl font-semibold"
          style={{ color: colors.textPrimary }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className="text-sm mt-0.5"
            style={{ color: colors.textSecondary }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};

// Badge component
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default' }) => {
  const variantStyles = {
    default: { bg: colors.bgLight, text: colors.textSecondary },
    success: { bg: colors.successLight, text: colors.success },
    warning: { bg: colors.warningLight, text: '#f57c00' },
    error: { bg: colors.errorLight, text: colors.error },
    info: { bg: colors.infoLight, text: colors.info }
  };

  const style = variantStyles[variant];

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {children}
    </span>
  );
};

// Button component
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  icon
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm'
  };

  const variantStyles = {
    primary: {
      backgroundColor: colors.primary,
      color: 'white',
      border: 'none'
    },
    secondary: {
      backgroundColor: 'transparent',
      color: colors.textPrimary,
      border: `1px solid ${colors.border}`
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.textSecondary,
      border: 'none'
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'} ${className}`}
      style={variantStyles[variant]}
    >
      {icon}
      {children}
    </button>
  );
};

// Empty state component
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div className="text-center py-8 sm:py-12">
      <div
        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
        style={{ backgroundColor: colors.bgLight }}
      >
        {icon}
      </div>
      <h3
        className="text-base sm:text-lg font-medium mb-1"
        style={{ color: colors.textPrimary }}
      >
        {title}
      </h3>
      {description && (
        <p
          className="text-sm mb-4 max-w-sm mx-auto"
          style={{ color: colors.textSecondary }}
        >
          {description}
        </p>
      )}
      {action}
    </div>
  );
};

// Stat card for dashboards
interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  change,
  changeType = 'neutral'
}) => {
  return (
    <Card padding="md">
      <div className="flex items-start justify-between">
        <div>
          <p
            className="text-xs sm:text-sm font-medium mb-1"
            style={{ color: colors.textSecondary }}
          >
            {label}
          </p>
          <p
            className="text-xl sm:text-2xl font-semibold"
            style={{ color: colors.textPrimary }}
          >
            {value}
          </p>
          {change && (
            <p
              className="text-xs mt-1"
              style={{
                color: changeType === 'positive' ? colors.success :
                       changeType === 'negative' ? colors.error :
                       colors.textMuted
              }}
            >
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div
            className="p-2 rounded-lg hidden sm:flex"
            style={{ backgroundColor: colors.primaryLight }}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default PageWrapper;