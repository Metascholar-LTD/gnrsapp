// Chart.js module
import Chart from "chart.js";

Chart.defaults.global.defaultFontFamily = "'Inter', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";

if (typeof window !== 'undefined') {
  (window as any).Chart = Chart;
}

export default Chart;

