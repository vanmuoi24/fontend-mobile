import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: "/admin/users", // 👈 khi chạy npm run dev, tự mở /admin
  },
});
