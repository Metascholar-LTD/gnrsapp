/**
 * Centralized Breakpoints Configuration
 * 
 * This file contains all breakpoint definitions used across the application.
 * Import these constants to ensure consistent responsive design across all pages.
 * 
 * Usage:
 * ```tsx
 * import { BREAKPOINTS, DIRECTORY_PADDING } from '@/lib/breakpoints';
 * 
 * const styles = `
 *   @media (max-width: ${BREAKPOINTS.MOBILE.MAX}px) {
 *     .my-element { padding: ${DIRECTORY_PADDING.MOBILE.PADDING}; }
 *   }
 * `;
 * ```
 */

/**
 * Breakpoint values in pixels
 */
export const BREAKPOINTS = {
  MOBILE: {
    MIN: 0,
    MAX: 767,
  },
  TABLET: {
    MIN: 768,
    MAX: 1199,
  },
  DESKTOP: {
    MIN: 1200,
    MAX: 1599,
  },
  LARGE_DESKTOP: {
    MIN: 1600,
    MAX: Infinity,
  },
} as const;

/**
 * Padding values for directory pages
 * These values are used consistently across all directory pages
 */
export const DIRECTORY_PADDING = {
  MOBILE: {
    PADDING: '1rem',
    PADDING_TOP: '60px',
  },
  TABLET: {
    PADDING: '1.5rem',
    PADDING_TOP: '70px',
  },
  DESKTOP: {
    PADDING: '2rem',
    PADDING_TOP: '120px',
  },
  LARGE_DESKTOP: {
    PADDING: '2rem clamp(2rem, 5vw, 4rem)',
    PADDING_TOP: '120px',
  },
} as const;

/**
 * Media query strings for easy use in CSS-in-JS or template literals
 */
export const MEDIA_QUERIES = {
  MOBILE: `(max-width: ${BREAKPOINTS.MOBILE.MAX}px)`,
  TABLET: `(min-width: ${BREAKPOINTS.TABLET.MIN}px) and (max-width: ${BREAKPOINTS.TABLET.MAX}px)`,
  DESKTOP: `(min-width: ${BREAKPOINTS.DESKTOP.MIN}px) and (max-width: ${BREAKPOINTS.DESKTOP.MAX}px)`,
  LARGE_DESKTOP: `(min-width: ${BREAKPOINTS.LARGE_DESKTOP.MIN}px)`,
  TABLET_AND_UP: `(min-width: ${BREAKPOINTS.TABLET.MIN}px)`,
  DESKTOP_AND_UP: `(min-width: ${BREAKPOINTS.DESKTOP.MIN}px)`,
} as const;

/**
 * Helper function to generate directory page styles
 * This ensures consistent styling across all directory pages
 * 
 * @param contentWrapperClass - Class name for the content wrapper
 * @param mainContentClass - Class name for the main content container
 * @returns CSS string with all breakpoint styles
 * 
 * @example
 * ```tsx
 * const styles = generateDirectoryStyles('my-page-wrapper', 'my-page-content');
 * ```
 */
export function generateDirectoryStyles(
  contentWrapperClass: string,
  mainContentClass: string
): string {
  return `
    /* Mobile: 0px - 767px */
    @media ${MEDIA_QUERIES.MOBILE} {
      .${contentWrapperClass} {
        padding-top: ${DIRECTORY_PADDING.MOBILE.PADDING_TOP};
      }

      .${mainContentClass} {
        padding: ${DIRECTORY_PADDING.MOBILE.PADDING};
      }
    }

    /* Tablet: 768px - 1199px */
    @media ${MEDIA_QUERIES.TABLET} {
      .${contentWrapperClass} {
        padding-top: ${DIRECTORY_PADDING.TABLET.PADDING_TOP};
      }

      .${mainContentClass} {
        padding: ${DIRECTORY_PADDING.TABLET.PADDING};
      }
    }

    /* Desktop: 1200px - 1599px */
    @media ${MEDIA_QUERIES.DESKTOP} {
      .${contentWrapperClass} {
        padding-top: ${DIRECTORY_PADDING.DESKTOP.PADDING_TOP};
      }

      .${mainContentClass} {
        padding: ${DIRECTORY_PADDING.DESKTOP.PADDING};
      }
    }

    /* Large Desktop: 1600px+ */
    @media ${MEDIA_QUERIES.LARGE_DESKTOP} {
      .${contentWrapperClass} {
        padding-top: ${DIRECTORY_PADDING.LARGE_DESKTOP.PADDING_TOP};
      }

      .${mainContentClass} {
        padding: ${DIRECTORY_PADDING.LARGE_DESKTOP.PADDING};
      }
    }
  `;
}

/**
 * Type definitions for breakpoint values
 */
export type Breakpoint = keyof typeof BREAKPOINTS;
export type DirectoryPadding = typeof DIRECTORY_PADDING;

