// Sidebar module
import SimpleBar from "simplebar";

export const initializeSidebar = () => {
  if (typeof window === 'undefined') return;

  const initializeSimplebar = () => {
    const simplebarElement = document.querySelector("#admin-scope .js-simplebar") as HTMLElement;

    if (simplebarElement) {
      // Check if SimpleBar is already initialized
      if ((simplebarElement as any).simpleBar) {
        try {
          (simplebarElement as any).simpleBar.unMount();
        } catch (e) {
          // Ignore unmount errors
        }
      }

      try {
        const simplebarInstance = new SimpleBar(simplebarElement, {
          autoHide: false,
          scrollbarMinSize: 50,
          forceVisible: false,
        });

        // Store instance for later use
        (simplebarElement as any).simpleBar = simplebarInstance;

        /* Recalculate simplebar on sidebar dropdown toggle */
        const sidebarDropdowns = document.querySelectorAll("#admin-scope .js-sidebar [data-bs-parent]");
        
        sidebarDropdowns.forEach(link => {
          link.addEventListener("shown.bs.collapse", () => {
            simplebarInstance.recalculate();
          });
          link.addEventListener("hidden.bs.collapse", () => {
            simplebarInstance.recalculate();
          });
        });
      } catch (error) {
        console.error("SimpleBar initialization error:", error);
      }
    }
  };

  const initializeSidebarCollapse = () => {
    const sidebarElement = document.querySelector("#admin-scope .js-sidebar") as HTMLElement;
    const sidebarToggleElements = document.querySelectorAll("#admin-scope .js-sidebar-toggle");

    if (!sidebarElement) return;

    // Helper function to update sidebar and main content state
    const updateSidebarState = (shouldCollapse: boolean) => {
      const mainElement = document.querySelector("#admin-scope .wrapper .main") as HTMLElement;
      
      if (shouldCollapse) {
        sidebarElement.classList.add("collapsed");
        if (mainElement) {
          mainElement.style.marginLeft = "0";
          mainElement.style.width = "100%";
        }
      } else {
        sidebarElement.classList.remove("collapsed");
        if (mainElement) {
          mainElement.style.marginLeft = "260px";
          mainElement.style.width = "calc(100% - 260px)";
        }
      }

      // Trigger resize event and recalculate SimpleBar
      sidebarElement.addEventListener("transitionend", () => {
        window.dispatchEvent(new Event("resize"));
        // Recalculate SimpleBar after collapse
        const simplebarElement = document.querySelector("#admin-scope .js-simplebar") as HTMLElement;
        if (simplebarElement && (simplebarElement as any).simpleBar) {
          try {
            (simplebarElement as any).simpleBar.recalculate();
          } catch (e) {
            // Ignore recalculate errors
          }
        }
      }, { once: true });
    };

    // Check if this is the initial load (sidebar doesn't have user-toggled attribute)
    const isInitialLoad = !sidebarElement.hasAttribute("data-user-toggled");
    
    // Function to check window size and adjust sidebar if user hasn't manually toggled
    const checkAndAdjustSidebar = () => {
      const userToggled = sidebarElement.hasAttribute("data-user-toggled");
      if (userToggled) return; // Respect user's manual toggle
      
      const windowWidth = window.innerWidth;
      const isSmallDesktop = windowWidth < 1600;
      const isCurrentlyCollapsed = sidebarElement.classList.contains("collapsed");
      
      if (isSmallDesktop && !isCurrentlyCollapsed) {
        // Auto-collapse on small desktops (< 1600px)
        updateSidebarState(true);
      } else if (!isSmallDesktop && isCurrentlyCollapsed) {
        // Auto-expand on larger desktops (>= 1600px)
        updateSidebarState(false);
      }
    };
    
    // On initial load, check window size and set default state
    if (isInitialLoad) {
      checkAndAdjustSidebar();
    }
    
    // Handle window resize - adjust sidebar if user hasn't manually toggled
    const handleResize = () => {
      checkAndAdjustSidebar();
    };
    
    window.addEventListener("resize", handleResize);

    const handleToggle = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Mark that user has manually toggled (so we don't auto-adjust on resize)
      sidebarElement.setAttribute("data-user-toggled", "true");
      
      sidebarElement.classList.toggle("collapsed");

      // Update main content margin
      const mainElement = document.querySelector("#admin-scope .wrapper .main") as HTMLElement;
      if (mainElement) {
        if (sidebarElement.classList.contains("collapsed")) {
          mainElement.style.marginLeft = "0";
          mainElement.style.width = "100%";
        } else {
          mainElement.style.marginLeft = "260px";
          mainElement.style.width = "calc(100% - 260px)";
        }
      }

      sidebarElement.addEventListener("transitionend", () => {
        window.dispatchEvent(new Event("resize"));
        // Recalculate SimpleBar after collapse
        const simplebarElement = document.querySelector("#admin-scope .js-simplebar") as HTMLElement;
        if (simplebarElement && (simplebarElement as any).simpleBar) {
          try {
            (simplebarElement as any).simpleBar.recalculate();
          } catch (e) {
            // Ignore recalculate errors
          }
        }
      }, { once: true });
    };

    // Remove old listeners and add new ones
    sidebarToggleElements.forEach(toggle => {
      const newToggle = toggle.cloneNode(true);
      toggle.parentNode?.replaceChild(newToggle, toggle);
      newToggle.addEventListener("click", handleToggle);
    });
  };

  // Always initialize immediately since we're called from useEffect
  initializeSimplebar();
  initializeSidebarCollapse();
};

