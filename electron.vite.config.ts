import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin(),
    ]
  },
  // preload: {
  //   plugins: [externalizeDepsPlugin()]
  // },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@api': resolve('src/api')
      }
    },
    plugins: [vue()]
  }
})
