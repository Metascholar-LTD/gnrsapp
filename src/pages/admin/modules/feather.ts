// Feather icons module
import feather from "feather-icons";

// Safe feather replace function that handles errors
const safeFeatherReplace = () => {
  try {
    // Only replace if feather is available and has icons
    if (feather && typeof feather.replace === 'function') {
      // Replace all elements with data-feather attribute
      const elements = document.querySelectorAll('[data-feather]');
      elements.forEach((el) => {
        try {
          const iconName = el.getAttribute('data-feather');
          if (iconName && feather.icons && feather.icons[iconName]) {
            const svg = feather.icons[iconName].toSvg({
              width: '16',
              height: '16',
            });
            el.outerHTML = svg;
          }
        } catch (e) {
          // Skip this element if it fails - don't break the whole page
          console.debug(`Failed to replace icon: ${el.getAttribute('data-feather')}`, e);
        }
      });
    }
  } catch (error) {
    console.warn("Feather icons replacement error:", error);
  }
};

export const initializeFeather = () => {
  if (typeof window !== 'undefined') {
    if (document.readyState === 'complete') {
      setTimeout(safeFeatherReplace, 100);
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        setTimeout(safeFeatherReplace, 100);
      });
    }
  }
};

// Make feather globally available
if (typeof window !== 'undefined') {
  (window as any).feather = feather;
}

export default feather;

