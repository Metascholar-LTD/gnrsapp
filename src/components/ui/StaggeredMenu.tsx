import React, {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";
import { ArrowLeft, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import "./staggered-menu.css";

export interface StaggeredMenuItem {
  id?: string;
  label: string;
  ariaLabel: string;
  link: string;
}

export interface StaggeredMenuSocialItem {
  label: string;
  link: string;
}

export interface StaggeredMenuProps {
  position?: "left" | "right";
  colors?: string[];
  items?: StaggeredMenuItem[];
  socialItems?: StaggeredMenuSocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  className?: string;
  logoUrl?: string;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  changeMenuColorOnOpen?: boolean;
  closeOnClickAway?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  isFixed?: boolean;
  onItemSelect?: (item: StaggeredMenuItem) => void;
}

export const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
  position = "right",
  colors = ["#B19EEF", "#5227FF"],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  logoUrl = '/src/assets/logos/reactbits-gh-white.svg',
  menuButtonColor = "#fff",
  openMenuButtonColor = "#fff",
  changeMenuColorOnOpen = true,
  accentColor = "#5227FF",
  isFixed = false,
  closeOnClickAway = true,
  onMenuOpen,
  onMenuClose,
  onItemSelect,
}: StaggeredMenuProps) => {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const openRef = useRef(false);
  
  // Handle responsive width and sidebar width
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    
    const updateSidebarWidth = () => {
      if (panelRef.current && open) {
        const width = panelRef.current.offsetWidth;
        setSidebarWidth(width);
      } else {
        setSidebarWidth(0);
      }
    };
    
    checkMobile();
    
    // Update sidebar width when panel opens/closes
    if (open) {
      // Small delay to ensure panel is rendered
      const timeoutId = setTimeout(() => {
        updateSidebarWidth();
      }, 50);
      
      // Also update on resize
      const handleResize = () => {
        checkMobile();
        updateSidebarWidth();
      };
      
      window.addEventListener('resize', handleResize);
      
      // Use ResizeObserver for more accurate width tracking
      const observer = new ResizeObserver(() => {
        updateSidebarWidth();
      });
      
      if (panelRef.current) {
        observer.observe(panelRef.current);
      }
      
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('resize', handleResize);
        observer.disconnect();
      };
    } else {
      setSidebarWidth(0);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, [open]);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const preLayersRef = useRef<HTMLDivElement | null>(null);
  const preLayerElsRef = useRef<HTMLElement[]>([]);

  // Removed old refs - no longer needed with new button design

  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const busyRef = useRef(false);
  const itemEntranceTweenRef = useRef<gsap.core.Tween | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;

      if (!panel) return;

      let preLayers: HTMLElement[] = [];
      if (preContainer) {
        preLayers = Array.from(
          preContainer.querySelectorAll(".sm-prelayer")
        ) as HTMLElement[];
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === "left" ? -100 : 100;
      // Panel slide is handled by Framer Motion, only set prelayers
      gsap.set(preLayers, { xPercent: offscreen });
    });

    return () => ctx.revert();
  }, [position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }
    itemEntranceTweenRef.current?.kill();

    const itemEls = Array.from(
      panel.querySelectorAll(".sm-panel-itemLabel")
    ) as HTMLElement[];
    const numberEls = Array.from(
      panel.querySelectorAll(
        ".sm-panel-list[data-numbering] .sm-panel-item"
      )
    ) as HTMLElement[];
    const socialTitle = panel.querySelector(
      ".sm-socials-title"
    ) as HTMLElement | null;
    const socialLinks = Array.from(
      panel.querySelectorAll(".sm-socials-link")
    ) as HTMLElement[];

    const layerStates = layers.map((el) => ({
      el,
      start: Number(gsap.getProperty(el, "xPercent")),
    }));
    // Panel slide is handled by Framer Motion, not GSAP

    if (itemEls.length) {
      gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    }
    if (numberEls.length) {
      gsap.set(numberEls, { ["--sm-num-opacity" as any]: 0 });
    }
    if (socialTitle) {
      gsap.set(socialTitle, { opacity: 0 });
    }
    if (socialLinks.length) {
      gsap.set(socialLinks, { y: 25, opacity: 0 });
    }

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(
        ls.el,
        { xPercent: ls.start },
        { xPercent: 0, duration: 0.5, ease: "power4.out" },
        i * 0.07
      );
    });

    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    // Panel slide animation removed - handled by Framer Motion

    if (itemEls.length) {
      const itemsStart = panelInsertTime + 0.1; // Start items animation shortly after layers
      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: "power4.out",
          stagger: { each: 0.1, from: "start" },
        },
        itemsStart
      );

      if (numberEls.length) {
        tl.to(
          numberEls,
          {
            duration: 0.6,
            ease: "power2.out",
            ["--sm-num-opacity" as any]: 1,
            stagger: { each: 0.08, from: "start" },
          },
          itemsStart + 0.1
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + 0.3; // Start socials animation after items

      if (socialTitle) {
        tl.to(
          socialTitle,
          { opacity: 1, duration: 0.5, ease: "power2.out" },
          socialsStart
        );
      }
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power3.out",
            stagger: { each: 0.08, from: "start" },
            onComplete: () => {
              gsap.set(socialLinks, { clearProps: "opacity" });
            },
          },
          socialsStart + 0.04
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, [position]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback("onComplete", () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;
    itemEntranceTweenRef.current?.kill();

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    // Panel slide is handled by Framer Motion, only reset item states
    const itemEls = Array.from(
      panel.querySelectorAll(".sm-panel-itemLabel")
    ) as HTMLElement[];
    if (itemEls.length) {
      gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    }

    const numberEls = Array.from(
      panel.querySelectorAll(
        ".sm-panel-list[data-numbering] .sm-panel-item"
      )
    ) as HTMLElement[];
    if (numberEls.length) {
      gsap.set(numberEls, { ["--sm-num-opacity" as any]: 0 });
    }

    const socialTitle = panel.querySelector(
      ".sm-socials-title"
    ) as HTMLElement | null;
    const socialLinks = Array.from(
      panel.querySelectorAll(".sm-socials-link")
    ) as HTMLElement[];
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, {
      y: 25,
      opacity: 0,
    });
    
    busyRef.current = false;
  }, []);

  // Removed old animation functions - using Framer Motion for button animations now

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);
    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      setIsClosing(true);
      playClose();
    }
  }, [playOpen, playClose, onMenuOpen, onMenuClose]);

  const closeMenu = useCallback(() => {
    if (openRef.current) {
      setIsClosing(true);
      openRef.current = false;
      setOpen(false);
      onMenuClose?.();
      playClose();
    }
  }, [playClose, onMenuClose]);

  // Reset closing state when panel opens
  React.useEffect(() => {
    if (open) {
      setIsClosing(false);
    }
  }, [open]);

  // Removed click outside handler - overlay handles closing

  const shouldRender = open || isClosing;

  return (
    <>
      {/* Header button - OUTSIDE AnimatePresence so it's always accessible */}
      <motion.header 
        className="staggered-menu-header" 
        aria-label="Main navigation header"
        animate={{
          x: open ? (position === 'left' ? sidebarWidth : -sidebarWidth) : 0,
        }}
        transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
        style={{
          zIndex: 10002, // Above overlay (9999) and panel (10000)
        } as React.CSSProperties}
      >
          <motion.button
          ref={toggleBtnRef}
          className="sm-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="staggered-menu-panel"
          onClick={(e) => {
            e.stopPropagation(); // Prevent overlay from catching the click
            toggleMenu();
          }}
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ type: 'tween', duration: 0.2 }}
              >
                <X size={20} strokeWidth={2.5} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ type: 'tween', duration: 0.2 }}
              >
                <Menu size={20} strokeWidth={2.5} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.header>

      <AnimatePresence>
        {shouldRender && (
          <>
            {/* Overlay - exactly like SkilledWorkerPanel */}
            <motion.div
              className="sm-overlay"
              onClick={closeMenu}
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: isClosing ? 0 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 9999,
                pointerEvents: 'auto',
              } as React.CSSProperties}
            />

            {/* Panel - OUTSIDE wrapper like SkilledWorkerPanel with slide animation */}
            <motion.aside
              key="panel"
              id="staggered-menu-panel"
              ref={panelRef}
              className="staggered-menu-panel"
              aria-hidden={!open}
              initial={{ x: position === 'left' ? '-100%' : '100%' }}
              animate={{ x: isClosing ? (position === 'left' ? '-100%' : '100%') : 0 }}
              exit={{ x: position === 'left' ? '-100%' : '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
              onAnimationStart={() => {
                if (open && panelRef.current) {
                  // Update sidebar width when animation starts
                  const width = panelRef.current.offsetWidth || 
                    (isMobile ? window.innerWidth : Math.min(window.innerWidth * 0.5, 420));
                  setSidebarWidth(width);
                }
              }}
              onAnimationComplete={() => {
                if (isClosing) {
                  setIsClosing(false);
                  setSidebarWidth(0);
                } else if (open && panelRef.current) {
                  // Ensure width is set after animation completes
                  const width = panelRef.current.offsetWidth;
                  setSidebarWidth(width);
                }
              }}
              onClick={(e) => {
                // Stop clicks inside panel from bubbling to overlay
                e.stopPropagation();
              }}
              style={{
                position: 'fixed',
                top: 0,
                [position === 'left' ? 'left' : 'right']: 0,
                bottom: 0,
                width: isMobile ? '100%' : 'clamp(260px, 38vw, 420px)',
                maxWidth: isMobile ? '100%' : '50%',
                height: '100%',
                backgroundColor: 'white',
                zIndex: 10000,
                overflowY: 'auto',
                boxShadow: position === 'left' ? '4px 0 24px rgba(0, 0, 0, 0.15)' : '-4px 0 24px rgba(0, 0, 0, 0.15)',
                pointerEvents: 'auto',
              } as React.CSSProperties}
            >
        <div className="sm-panel-inner">
          {/* Header with Back Button - Only on Mobile */}
          {isMobile && (
            <div className="sm-panel-header">
              <button 
                onClick={closeMenu}
                className="sm-panel-back-button"
                aria-label="Close menu"
              >
                <ArrowLeft style={{ width: '24px', height: '24px' }} />
              </button>
            </div>
          )}
          
          <ul
            className="sm-panel-list"
            role="list"
            data-numbering={displayItemNumbering || undefined}
          >
            {items && items.length ? (
              items.map((it, idx) => (
                <li className="sm-panel-itemWrap" key={it.label + idx}>
                  <Link
                    to={it.link}
                    className="sm-panel-item"
                    aria-label={it.ariaLabel}
                    data-index={idx + 1}
                    onClick={() => {
                      if (onItemSelect) {
                        onItemSelect(it);
                      }
                      closeMenu();
                    }}
                  >
                    <span className="sm-panel-itemLabel">{it.label}</span>
                  </Link>
                </li>
              ))
            ) : (
              <li className="sm-panel-itemWrap" aria-hidden="true">
                <span className="sm-panel-item">
                  <span className="sm-panel-itemLabel">No items</span>
                </span>
              </li>
            )}
          </ul>

          {displaySocials && socialItems && socialItems.length > 0 && (
            <div className="sm-socials" aria-label="Social links">
              <h3 className="sm-socials-title">Socials</h3>
              <ul className="sm-socials-list" role="list">
                {socialItems.map((s, i) => (
                  <li key={s.label + i} className="sm-socials-item">
                    <a
                      href={s.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sm-socials-link"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div
        className={
          (className ? className + " " : "") +
          "staggered-menu-wrapper" +
          (isFixed ? " fixed-wrapper" : "")
        }
        style={
          accentColor
            ? ({ ["--sm-accent" as any]: accentColor } as React.CSSProperties)
            : undefined
        }
        data-position={position}
        data-open={open || undefined}
      >
        <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
          {(() => {
            const raw =
              colors && colors.length ? colors.slice(0, 4) : ["#1e1e22", "#35353c"];
            let arr = [...raw];
            if (arr.length >= 3) {
              const mid = Math.floor(arr.length / 2);
              arr.splice(mid, 1);
            }
            return arr.map((c, i) => (
              <div key={i} className="sm-prelayer" style={{ background: c }} />
            ));
          })()}
        </div>
      </div>
    </>
  );
};

export default StaggeredMenu;


