import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],

  server: {
    host: true, // 0.0.0.0としてリッスンし、WSLからの通信をWindows側に通す
    hmr: {
      clientPort: 5173, // クライアント側のポートを明示的に指定
    },
    watch: {
      usePolling: true, // WSL環境でファイルの変更検知を確実に行うための設定
    },
  },

});
