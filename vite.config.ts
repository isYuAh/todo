import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers';
import path from 'path';
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ArcoResolver()],
    }),
    Components({
      resolvers: [
        ArcoResolver({
          sideEffect: true
        }),
      ],
    }),
    visualizer({  
      open: true, // 注意这里要设置为true，否则无效  
      gzipSize: true, // 分析图生成的文件名  
      brotliSize: true, // 收集 brotli 大小并将其显示  
      filename: "stats.html", // 分析图生成的文件名  
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    // sourcemap: true,
  }
  
})
