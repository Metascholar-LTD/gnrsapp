import { ReactNode } from "react";

interface HeroButtonProps {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

export const HeroButton = ({ onClick, children, className = "" }: HeroButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`education-hero-btn ${className}`}
    >
      <div className="education-hero-btn__text">{children}</div>
    </button>
  );
};

