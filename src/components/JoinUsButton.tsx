import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";

interface JoinUsButtonProps {
  to?: string;
  className?: string;
  onClick?: () => void;
}

export const JoinUsButton = ({ to = "/join", className = "", onClick }: JoinUsButtonProps) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`group relative overflow-hidden border-2 cursor-pointer transition-all duration-500 ease-out
                  shadow-md hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-95
                  inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-md text-sm
                  border-indigo-500/40 bg-gradient-to-br from-indigo-500/35 via-indigo-400/35 to-indigo-500/55
                  self-center min-w-[110px]
                  ${className}`}
      style={{ height: 'fit-content', lineHeight: '1.5' }}
    >
      {/* Moving gradient layer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-300/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>

      {/* Overlay glow */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-400/20 via-indigo-300/10 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Content */}
      <div className="relative z-10 flex items-center gap-2">
        {/* Icon */}
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500/50 to-indigo-400/30 backdrop-blur-sm group-hover:from-indigo-400/60 group-hover:to-indigo-500/40 transition-all duration-300">
          <UserPlus className="h-4 w-4 text-white group-hover:text-white/90 transition-all duration-300 group-hover:scale-110 drop-shadow-lg" />
        </div>

        {/* Text */}
        <span className="text-white font-bold text-sm group-hover:text-white transition-colors duration-300 drop-shadow-md whitespace-nowrap">
          Join Us
        </span>
      </div>
    </Link>
  );
};

