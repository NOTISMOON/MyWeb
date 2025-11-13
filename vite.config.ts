// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import compression from 'vite-plugin-compression'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd())
    return {
        base: env.VITE_APP_BASE || '/MyWeb/',
        server: {
            host: '0.0.0.0', // 允许局域网访问（默认只允许本机 localhost）
            strictPort: true, // 如果端口被占用，不要自动换端口，直接报错
            open: true, // 启动时自动打开浏览器
            proxy: {
                '/api': {
                    target: env.VITE_APP_BASE_URL,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, '') // 重写路径
                }
            }
        },
        plugins: [
            vue(),
            visualizer({
                open: true, // 打包后自动打开分析页面
                gzipSize: true, // 显示 gzip 压缩后的体积
                brotliSize: true, // 显示 brotli 压缩后的体积
                filename: 'bundle-analyzer.html' // 分析结果文件名称（默认在 dist 目录）
            }),
            tailwindcss(),
            AutoImport({
                resolvers: [
                    ArcoResolver({
                        // 只导入组件相关的 API，不自动导入工具类（避免冗余）
                        importStyle: false, // 样式由 Components 插件处理，这里关闭
                        functions: ['Message', 'Notification'] // 只保留实际用到的工具函数（按需添加）
                    })
                ]
            }),
            Components({
                resolvers: [
                    ArcoResolver({
                        sideEffect: true,
                        importStyle: 'css' // 避免全量引入样式文件
                    })
                ],
                dirs: [], // 关闭自动扫描本地组件（避免误判）
                dts: false, // 不需要生成类型文件可关闭
                exclude: [/^Result\/(500|403)$/, /^Table$/, /^DatePicker\/RangePicker$/, /^Tree$/]
            }),
            compression({
                algorithm: 'brotliCompress', // 使用 Brotli 算法
                ext: '.br', // 压缩文件后缀
                threshold: 1024, // 大于 1KB 的文件才压缩（小文件收益低）
                compressionOptions: { level: 6 }, // 压缩级别（1-9，6 性价比最高）
                deleteOriginFile: false // 保留原文件，避免兼容问题
            }),
            // 兼容不支持 Brotli 的环境，同时生成 Gzip 压缩
            compression({
                algorithm: 'gzip', // 使用 Gzip 算法
                ext: '.gz',
                threshold: 1024,
                compressionOptions: { level: 6 },
                deleteOriginFile: false
            })
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                '@components': path.resolve(__dirname, './src/components'),
                '@utils': path.resolve(__dirname, './src/utils'),
                '@view': path.resolve(__dirname, './src/view'),
                '@store': path.resolve(__dirname, './src/store')
            }
        }
    }
})
