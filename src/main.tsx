import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Ensure dark background and loader visibility before React renders
document.documentElement.style.backgroundColor = '#000000';
document.body.style.backgroundColor = '#000000';
const loaderWrapper = document.getElementById('loader-wrapper');
if (loaderWrapper) {
  loaderWrapper.style.display = 'block';
  loaderWrapper.style.visibility = 'visible';
  loaderWrapper.style.opacity = '1';
}

createRoot(document.getElementById("root")!).render(<App />);
