import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './PageLoader.css';

const phrases = [
  "Connecting to GNRS",
  "Loading national resources",
  "Fetching education opportunities",
  "Retrieving scholarship data",
  "Loading job listings",
  "Accessing university directories",
  "Preparing skilled workers",
  "Syncing national information",
  "Optimizing resource delivery",
  "Validating user access",
  "Preparing your dashboard",
  "Loading educational content",
  "Fetching latest opportunities",
  "Preparing comprehensive resources",
  "Accessing national databases",
  "Loading directory information",
  "Syncing government systems",
  "Preparing personalized content",
  "Connecting GNRS platform",
  "Loading system resources"
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createSVG(tag: string, properties: Record<string, string>, children?: SVGElement[]): SVGElement {
  const newElement = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const prop in properties) {
    newElement.setAttribute(prop, properties[prop]);
  }
  if (children) {
    children.forEach((child) => {
      newElement.appendChild(child);
    });
  }
  return newElement as SVGElement;
}

function createPhraseSvg(phrase: string, yOffset: number): SVGTextElement {
  // Limit phrase to 4 words maximum - no ellipsis, show full phrase
  const words = phrase.split(' ').slice(0, 4).join(' ');
  
  const text = createSVG("text", {
    fill: "white",
    x: "50",
    y: yOffset.toString(),
    "font-size": "18",
    "font-family": "Arial, sans-serif",
    "text-anchor": "start",
    "dominant-baseline": "middle",
    "xml:space": "preserve",
    "class": "phrase-text"
  }) as unknown as SVGTextElement;
  
  // Create tspan to prevent wrapping and ensure all text is visible
  const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
  tspan.setAttribute("x", "50");
  tspan.setAttribute("dy", "0");
  tspan.setAttribute("xml:space", "preserve");
  tspan.setAttribute("style", "white-space: nowrap;");
  tspan.textContent = words;
  text.appendChild(tspan);
  
  return text;
}

function createCheckSvg(yOffset: number, index: number): SVGGElement {
  const checkmarkIdPrefix = "loadingCheckSVG-";
  const checkmarkCircleIdPrefix = "loadingCheckCircleSVG-";
  
  const check = createSVG("polygon", {
    points: "21.661,7.643 13.396,19.328 9.429,15.361 7.075,17.714 13.745,24.384 24.345,9.708 ",
    fill: "rgba(255,255,255,1)",
    id: checkmarkIdPrefix + index
  });

  const circle_outline = createSVG("path", {
    d: "M16,0C7.163,0,0,7.163,0,16s7.163,16,16,16s16-7.163,16-16S24.837,0,16,0z M16,30C8.28,30,2,23.72,2,16C2,8.28,8.28,2,16,2 c7.72,0,14,6.28,14,14C30,23.72,23.72,30,16,30z",
    fill: "white"
  });

  const circle = createSVG("circle", {
    id: checkmarkCircleIdPrefix + index,
    fill: "rgba(255,255,255,0)",
    cx: "16",
    cy: "16",
    r: "15"
  });

  const group = createSVG(
    "g",
    {
      transform: "translate(10 " + (yOffset - 20) + ") scale(.9)"
    },
    [circle, check, circle_outline]
  ) as unknown as SVGGElement;
  
  return group;
}

function easeInOut(t: number): number {
  const period = 200;
  return (Math.sin(t / period + 100) + 1) / 2;
}

export const PageLoader = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const phrasesRef = useRef<SVGGElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const currentYRef = useRef<number>(0);
  const verticalSpacing = 50;
  const checkmarkIdPrefix = "loadingCheckSVG-";
  const checkmarkCircleIdPrefix = "loadingCheckCircleSVG-";
  const minDisplayTimeRef = useRef<number>(2500); // Minimum 2.5 seconds display time
  const initializedRef = useRef<boolean>(false);
  const previousPathRef = useRef<string>('');

  // Check if path is an auth page
  const isAuthPage = (path: string): boolean => {
    return path.startsWith('/scholarly/auth/');
  };

  // Reset loader on route change
  useEffect(() => {
    const currentPath = location.pathname;
    const previousPath = previousPathRef.current;
    
    // Skip loader if navigating between auth pages
    if (isAuthPage(currentPath) && isAuthPage(previousPath) && previousPath !== '') {
      // If loader is already showing, hide it immediately
      if (isLoading) {
        setIsLoading(false);
        document.body.classList.add('loaded', 'preloaded');
        document.documentElement.classList.add('loaded', 'preloaded');
        document.body.style.setProperty('overflow', 'auto', 'important');
        document.documentElement.style.setProperty('overflow', 'auto', 'important');
        const rootElement = document.getElementById('root');
        if (rootElement) {
          rootElement.style.opacity = '1';
          rootElement.style.pointerEvents = 'auto';
        }
        const loaderWrapper = document.getElementById('loader-wrapper');
        if (loaderWrapper) {
          loaderWrapper.style.display = 'none';
        }
      }
      previousPathRef.current = currentPath;
      return; // Don't show loader when switching between auth pages
    }
    
    previousPathRef.current = currentPath;
    
    setIsLoading(true);
    currentYRef.current = 0;
    startTimeRef.current = Date.now();
    initializedRef.current = false;
    
    // Set dark background immediately to prevent white flash
    document.documentElement.style.backgroundColor = '#000000';
    document.body.style.backgroundColor = '#000000';
    document.body.style.setProperty('overflow', 'hidden', 'important');
    document.documentElement.style.setProperty('overflow', 'hidden', 'important');
    
    // Ensure loader wrapper is visible
    const loaderWrapper = document.getElementById('loader-wrapper');
    if (loaderWrapper) {
      loaderWrapper.style.display = 'block';
      loaderWrapper.style.visibility = 'visible';
      loaderWrapper.style.opacity = '1';
    }
    
    // Hide body content while loading
    document.body.classList.remove('loaded', 'preloaded');
    document.documentElement.classList.remove('loaded', 'preloaded');
    
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.style.opacity = '0';
      rootElement.style.pointerEvents = 'none';
      rootElement.style.transition = 'none';
      rootElement.style.backgroundColor = '#000000';
    }
  }, [location.pathname]);
  
  // Set dark background on initial mount
  useEffect(() => {
    document.documentElement.style.backgroundColor = '#000000';
    document.body.style.backgroundColor = '#000000';
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // Clean up if not loading
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }
    
    let timeoutIds: NodeJS.Timeout[] = [];
    let maxTimeoutId: NodeJS.Timeout | null = null;
    
    // Ensure loader wrapper is visible immediately
    requestAnimationFrame(() => {
      const loaderWrapper = document.getElementById('loader-wrapper');
      if (loaderWrapper) {
        loaderWrapper.style.display = 'block';
        loaderWrapper.style.visibility = 'visible';
        loaderWrapper.style.opacity = '1';
      }
    });
    
    // Wait for DOM to be ready
    const initLoader = () => {
      // Initialize phrases
      const shuffledPhrases = shuffleArray(phrases);
      const phrasesElement = document.getElementById("phrases");
      
      if (phrasesElement && phrasesElement instanceof SVGGElement) {
        phrasesRef.current = phrasesElement;
        
        // Clear existing content
        phrasesElement.innerHTML = '';
        
        // Add phrases and checkmarks
        shuffledPhrases.forEach((phrase, index) => {
          const yOffset = 30 + verticalSpacing * index;
          phrasesElement.appendChild(createPhraseSvg(phrase, yOffset));
          phrasesElement.appendChild(createCheckSvg(yOffset, index));
        });

        // Start animation
        const animateLoading = () => {
          if (!isLoading) return;
          
          const now = Date.now();
          const upward_moving_group = phrasesElement;
          
          if (upward_moving_group) {
            upward_moving_group.setAttribute(
              "transform",
              "translate(0 " + currentYRef.current + ")"
            );
            
            currentYRef.current -= 1.35 * easeInOut(now);
            
            // Update checkmarks
            shuffledPhrases.forEach((_, i) => {
              const color_change_boundary = -i * verticalSpacing + verticalSpacing + 15;
              if (currentYRef.current < color_change_boundary) {
                const alpha = Math.max(
                  Math.min(
                    1 - (currentYRef.current - color_change_boundary + 15) / 30,
                    1
                  ),
                  0
                );
                
                const circle = document.getElementById(checkmarkCircleIdPrefix + i);
                const check = document.getElementById(checkmarkIdPrefix + i);
                
                if (circle) {
                  circle.setAttribute("fill", "rgba(255, 255, 255, " + alpha + ")");
                }
                
                if (check) {
                  const check_color = [
                    Math.round(255 * (1 - alpha) + 120 * alpha),
                    Math.round(255 * (1 - alpha) + 154 * alpha)
                  ];
                  check.setAttribute(
                    "fill",
                    "rgba(255, " + check_color[0] + "," + check_color[1] + ", 1)"
                  );
                }
              }
            });
            
            const elapsed = now - startTimeRef.current;
            if (elapsed < 30000 && currentYRef.current > -710 && isLoading) {
              animationFrameRef.current = requestAnimationFrame(animateLoading);
            }
          }
        };
        
        // Start animation after a short delay
        const animTimeout = setTimeout(() => {
          if (isLoading) {
            animationFrameRef.current = requestAnimationFrame(animateLoading);
          }
        }, 100);
        timeoutIds.push(animTimeout);
      }
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      setTimeout(initLoader, 100);
    });

    // Hide loader with minimum display time
    const hideLoader = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const remainingTime = Math.max(0, minDisplayTimeRef.current - elapsed);
      
      const hideTimeout = setTimeout(() => {
        // Update state first
        setIsLoading(false);
        
        // Add body and html classes for CSS transitions
        document.body.classList.add('loaded');
        document.body.classList.add('preloaded');
        document.documentElement.classList.add('loaded');
        document.documentElement.classList.add('preloaded');
        
        // Restore scrolling - CRITICAL: Force restore immediately
        document.body.style.setProperty('overflow', 'auto', 'important');
        document.body.style.setProperty('overflow-y', 'auto', 'important');
        document.body.style.setProperty('overflow-x', 'hidden', 'important');
        document.documentElement.style.setProperty('overflow', 'auto', 'important');
        document.documentElement.style.setProperty('overflow-y', 'auto', 'important');
        document.documentElement.style.setProperty('overflow-x', 'hidden', 'important');
        document.body.style.removeProperty('background-color');
        document.documentElement.style.removeProperty('background-color');
        
        // Double-check after a frame to ensure it stuck
        requestAnimationFrame(() => {
          if (document.body.style.overflow !== 'auto') {
            document.body.style.setProperty('overflow', 'auto', 'important');
          }
          if (document.documentElement.style.overflow !== 'auto') {
            document.documentElement.style.setProperty('overflow', 'auto', 'important');
          }
        });
        
        // Show body content immediately
        const rootElement = document.getElementById('root');
        if (rootElement) {
          rootElement.style.transition = 'opacity 0.5s ease-in-out';
          rootElement.style.opacity = '1';
          rootElement.style.pointerEvents = 'auto';
          rootElement.style.removeProperty('background-color');
        }
        
        // Hide loader wrapper with transition
        const loaderWrapper = document.getElementById('loader-wrapper');
        if (loaderWrapper) {
          loaderWrapper.style.transition = 'opacity 0.3s ease-out';
          loaderWrapper.style.opacity = '0';
          setTimeout(() => {
            loaderWrapper.style.visibility = 'hidden';
            loaderWrapper.style.display = 'none';
            loaderWrapper.style.transition = '';
          }, 300);
        }
      }, remainingTime);
      timeoutIds.push(hideTimeout);
    };

    // Set timeout for maximum display (15 seconds)
    maxTimeoutId = setTimeout(() => {
      if (isLoading) {
        hideLoader();
      }
    }, 15000);

    // Always wait minimum time, even if page is already loaded
    if (document.readyState === 'complete') {
      // Still respect minimum display time
      const minTimeout = setTimeout(() => {
        if (isLoading) {
          hideLoader();
        }
      }, minDisplayTimeRef.current);
      timeoutIds.push(minTimeout);
    } else {
      // Wait for window load event
      const loadHandler = () => {
        if (isLoading) {
          hideLoader();
        }
      };
      window.addEventListener('load', loadHandler, { once: true });
      
      // Also set a fallback timeout in case load event doesn't fire
      const fallbackTimeout = setTimeout(() => {
        if (isLoading) {
          hideLoader();
        }
      }, minDisplayTimeRef.current + 1000);
      timeoutIds.push(fallbackTimeout);
    }

    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
      if (maxTimeoutId) clearTimeout(maxTimeoutId);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isLoading, location.pathname]);

  // The loader HTML is already in index.html for instant display
  // This component just manages its visibility and animations
  useEffect(() => {
    const loaderWrapper = document.getElementById('loader-wrapper');
    const rootElement = document.getElementById('root');
    
    if (!loaderWrapper) return;
    
    if (isLoading) {
      // Show loader
      loaderWrapper.style.setProperty('display', 'block', 'important');
      loaderWrapper.style.setProperty('visibility', 'visible', 'important');
      loaderWrapper.style.setProperty('opacity', '1', 'important');
      loaderWrapper.style.setProperty('transition', 'none', 'important');
      loaderWrapper.style.setProperty('pointer-events', 'auto', 'important');
      loaderWrapper.style.setProperty('z-index', '99999999', 'important');
      
      // Hide root content
      if (rootElement) {
        rootElement.style.opacity = '0';
        rootElement.style.pointerEvents = 'none';
      }
    } else {
      // Hide loader - force it with important flags
      loaderWrapper.style.setProperty('opacity', '0', 'important');
      loaderWrapper.style.setProperty('pointer-events', 'none', 'important');
      loaderWrapper.style.setProperty('transition', 'opacity 0.3s ease-out', 'important');
      
      setTimeout(() => {
        loaderWrapper.style.setProperty('visibility', 'hidden', 'important');
        loaderWrapper.style.setProperty('display', 'none', 'important');
        loaderWrapper.style.setProperty('z-index', '-1', 'important');
      }, 300);
      
      // Show root content
      if (rootElement) {
        rootElement.style.transition = 'opacity 0.5s ease-in-out';
        rootElement.style.opacity = '1';
        rootElement.style.pointerEvents = 'auto';
        rootElement.style.removeProperty('background-color');
      }
      
      // Ensure body and html classes are set and restore scrolling
      document.body.classList.add('loaded');
      document.body.classList.add('preloaded');
      document.documentElement.classList.add('loaded');
      document.documentElement.classList.add('preloaded');
      // Force restore scrolling with important flags - CRITICAL: Do immediately
      document.body.style.setProperty('overflow', 'auto', 'important');
      document.body.style.setProperty('overflow-y', 'auto', 'important');
      document.body.style.setProperty('overflow-x', 'hidden', 'important');
      document.documentElement.style.setProperty('overflow', 'auto', 'important');
      document.documentElement.style.setProperty('overflow-y', 'auto', 'important');
      document.documentElement.style.setProperty('overflow-x', 'hidden', 'important');
      document.body.style.removeProperty('background-color');
      document.documentElement.style.removeProperty('background-color');
      
      // Double-check after a frame
      requestAnimationFrame(() => {
        if (document.body.style.overflow !== 'auto') {
          document.body.style.setProperty('overflow', 'auto', 'important');
        }
        if (document.documentElement.style.overflow !== 'auto') {
          document.documentElement.style.setProperty('overflow', 'auto', 'important');
        }
      });
    }
  }, [isLoading]);

  // Return null since loader HTML is in index.html
  return null;
};

