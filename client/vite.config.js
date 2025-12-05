import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig(({ mode }) => {
  // Load envs manually
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    // Dev only (ignored on Render)
    server: {
      proxy: {
        "/api": {
          target: env.VITE_BACKEND_URL, // Now works!
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
