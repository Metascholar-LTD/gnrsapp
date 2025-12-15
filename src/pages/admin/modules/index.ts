// AdminKit modules initialization
import "./bootstrap";
import "./theme";
import "./feather";
import "./chartjs";
import "./flatpickr";
import "./vector-maps";
import { initializeSidebar } from "./sidebar";
import { initializeFeather } from "./feather";

export const initializeAdminKit = () => {
  // Initialize modules after DOM is ready
  if (typeof window !== 'undefined') {
    if (document.readyState === 'complete') {
      initializeSidebar();
      initializeFeather();
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        initializeSidebar();
        initializeFeather();
      });
    }
  }
};

