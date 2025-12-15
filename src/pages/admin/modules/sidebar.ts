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

    const handleToggle = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      
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

