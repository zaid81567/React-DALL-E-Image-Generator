import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  //specifying the output directory for build file
  build: {
    outDir: "build",
  },
});
