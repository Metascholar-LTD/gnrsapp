// Bootstrap module
import * as bootstrap from "bootstrap";

// Make bootstrap globally available
if (typeof window !== 'undefined') {
  (window as any).bootstrap = bootstrap;
}

export default bootstrap;

