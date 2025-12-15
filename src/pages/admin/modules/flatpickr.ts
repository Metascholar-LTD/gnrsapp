// Flatpickr module
import flatpickr from "flatpickr";

if (typeof window !== 'undefined') {
  (window as any).flatpickr = flatpickr;
}

export default flatpickr;

