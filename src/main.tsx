import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeConfig } from "./config/config";

// Initialize configuration before rendering app
const initApp = async () => {
  const backendUrl = import.meta.env.VITE_API_BASE_URL;
  
  if (!backendUrl) {
    const errorMessage = "VITE_API_BASE_URL environment variable is required";
    console.error(errorMessage);
    const root = document.getElementById("root");
    if (root) {
      root.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; text-align: center; font-family: system-ui;">
          <div>
            <h1 style="color: red; margin-bottom: 20px;">Configuration Error</h1>
            <p>${errorMessage}</p>
            <p style="margin-top: 20px; color: #666;">Please set VITE_API_BASE_URL environment variable before starting the app.</p>
          </div>
        </div>
      `;
    }
    return;
  }
  
  try {
    await initializeConfig(backendUrl);
    console.log("Configuration initialized successfully");
    
    // Render app after config is loaded
    createRoot(document.getElementById("root")!).render(<App />);
  } catch (error) {
    console.error("Failed to initialize configuration:", error);
    const root = document.getElementById("root");
    if (root) {
      root.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; text-align: center; font-family: system-ui;">
          <div>
            <h1 style="color: red; margin-bottom: 20px;">Configuration Error</h1>
            <p>Failed to load configuration from backend.</p>
            <p style="margin-top: 10px; color: #666;">${error instanceof Error ? error.message : 'Unknown error'}</p>
            <p style="margin-top: 20px; color: #666;">Please ensure the backend is running at: ${backendUrl}</p>
            <p style="margin-top: 10px; color: #666;">And the /api/config endpoint is accessible.</p>
          </div>
        </div>
      `;
    }
  }
};

initApp();
