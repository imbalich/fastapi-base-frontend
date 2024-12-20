/**
 * 用于生产环境的文件压缩插件配置
 * 支持 gzip 和 brotli 两种压缩方式
 */
import type { PluginOption } from 'vite';
import compressPlugin from 'vite-plugin-compression';

/**
 * @param compress - 压缩算法类型 ('gzip' | 'brotli' | 'none')
 * @returns Vite 插件配置
 */
export default function configCompressPlugin(
  compress: 'gzip' | 'brotli' | 'none'
): PluginOption | PluginOption[] {
  const plugins: PluginOption[] = [];

  // 根据压缩类型配置相应的插件
  if (compress === 'gzip') {
    plugins.push(
      compressPlugin({
        ext: '.gz', // 生成的压缩包后缀
        algorithm: 'gzip', // 压缩算法
        deleteOriginFile: false, // 是否删除原文件
      })
    );
  }
  if (compress === 'brotli') {
    plugins.push(
      compressPlugin({
        ext: '.br', // 生成的压缩包后缀
        algorithm: 'brotliCompress', // 压缩算法
        deleteOriginFile: false, // 是否删除原文件
      })
    );
  }
  return plugins;
}
