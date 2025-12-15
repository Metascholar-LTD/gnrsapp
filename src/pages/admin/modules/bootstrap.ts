// Bootstrap module - Scoped to admin only
import * as bootstrap from "bootstrap";

// Make bootstrap available only within admin scope
// Don't pollute global namespace - use it only within admin components
if (typeof window !== 'undefined') {
  // Store in a namespaced location to avoid conflicts
  if (!(window as any).adminBootstrap) {
    (window as any).adminBootstrap = bootstrap;
  }
  // Also make it available as bootstrap but only for admin use
  (window as any).bootstrap = bootstrap;
}

export default bootstrap;

