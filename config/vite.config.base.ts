import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import svgLoader from 'vite-svg-loader';
import configArcoStyleImportPlugin from './plugin/arcoStyleImport';

export default defineConfig({
  // Vite 插件配置
  plugins: [
    vue(), // Vue 3 支持
    vueJsx(), // JSX/TSX 支持
    svgLoader({ svgoConfig: {} }), // SVG 文件支持
    configArcoStyleImportPlugin(), // ArcoDesign 样式按需导入
  ],
  // 路径解析配置
  resolve: {
    // 路径别名配置
    alias: [
      {
        find: '@', // 导入路径中的 @ 将被替换为 src 目录的绝对路径
        replacement: resolve(__dirname, '../src'),
      },
      {
        find: 'assets', // 导入路径中的 assets 将被替换为 src/assets 目录
        replacement: resolve(__dirname, '../src/assets'),
      },
      {
        find: 'vue-i18n',
        replacement: 'vue-i18n/dist/vue-i18n.cjs.js', // 解决 i18n 警告问题
      },
      {
        find: 'vue',
        replacement: 'vue/dist/vue.esm-bundler.js', // 使用完整版 Vue，支持运行时模板编译
      },
    ],
    // 导入文件的扩展名配置
    extensions: ['.ts', '.js'],
  },
  // 全局变量定义
  define: {
    'process.env': {}, // 定义 process.env 对象，避免运行时报错
  },
  // CSS 相关配置
  css: {
    preprocessorOptions: {
      less: {
        // Less 配置
        modifyVars: {
          // 注入全局 Less 变量
          hack: `true; @import (reference) "${resolve(
            'src/assets/style/breakpoint.less'
          )}";`,
        },
        javascriptEnabled: true, // 启用 Less 中的 JavaScript
      },
    },
  },
});
