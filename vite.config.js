import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import eslintPlugin from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    eslintPlugin({
      exclude: ["/@react-refresh", "**/*.css"]
    }),
    reactRefresh()
  ],
  server: {
    hmr: {
      port: 443
    }
  }
});
