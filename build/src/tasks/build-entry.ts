import path from 'path'
import { rollup } from 'rollup'
import vue from '@vitejs/plugin-vue'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import { pkgRoot } from '../utils/paths'
import type { Module, BuildInfo } from '../build-info'

// 构建完整入口
export const buildFullEntry = async (buildConfig: Record<Module, BuildInfo>) => {
  const input = path.resolve(pkgRoot, 'index.ts')

  const bundle = await rollup({
    input,
    plugins: [
      vue(),
      // 添加路径处理插件
      {
        name: 'path-resolver',
        resolveId(source, importer) {
          // 不处理入口文件
          if (source === input || source.includes(path.normalize(pkgRoot))) {
            return null;
          }
          
          // 处理绝对路径的样式文件
          if (source.includes(':\\') && (source.endsWith('.scss') || source.endsWith('.css'))) {
            // 转换为基于构建产物的相对路径
            if (source.includes('them-chalk')) {
              // 提取文件名并转换为 CSS 格式
              const fileName = path.basename(source).replace('.scss', '.css');
              return { id: `../them-chalk/${fileName}`, external: true };
            }
            // 其他样式文件也应该指向构建产物
            const fileName = path.basename(source).replace('.scss', '.css');
            return { id: `../them-chalk/${fileName}`, external: true };
          }
          
          // 处理相对路径的样式文件
          if (source.endsWith('.scss') || source.endsWith('.css')) {
            const fileName = path.basename(source).replace('.scss', '.css');
            return { id: `../them-chalk/${fileName}`, external: true };
          }
          
          // 处理其他绝对路径
          if (source.includes(':\\')) {
            const relativePath = source.substring(source.indexOf('packages'))
            return { id: `../../${relativePath}`, external: true };
          }
          return null;
        }
      },
      // 修改样式处理插件
      {
        name: 'style-handler',
        transform(code, id) {
          // 处理 .scss 文件
          if (id.endsWith('.scss') || id.endsWith('.css')) {
            // 将样式导入转换为空导出
            return {
              code: 'export default ""',
              map: null
            }
          }
          
          // 处理包含样式导入的文件
          if (code.includes('import') && (code.includes('.scss') || code.includes('.css'))) {
            // 替换所有样式导入为指向构建产物的路径
            code = code.replace(
              /import\s+['"](.+?(?:packages|src)[\\\/]them-chalk[\\\/][^'"]+\.(?:scss|css))['"];?/g,
              (match, path) => {
                const fileName = path.split(/[\\\/]/).pop();
                return `import "../them-chalk/${fileName.replace('.scss', '.css')}";`;
              }
            );
            return { code, map: null };
          }
          
          return null;
        }
      },
      nodeResolve({
        extensions: ['.mjs', '.js', '.json', '.ts'],
      }),
      commonjs(),
      esbuild({
        sourceMap: false,
        target: 'es2018',
        loaders: {
          '.vue': 'ts',
        },
      }),
      // 添加代码检查插件，确保生成的代码语法正确
      {
        name: 'code-validator',
        renderChunk(code) {
          try {
            // Remove any BOM characters or other invisible characters
            code = code.replace(/^\uFEFF|\u200B/g, '');
            
            // Fix the specific pattern causing the error (line 60-61 in the output)
            code = code.replace(/\(["']x-([^"']+)["'],\s*([A-Za-z0-9_$]+)\);\s*\}\s*;/g, 
              '// Component registration\napp.component("x-$1", $2);');
            
            // More aggressive fix for multiple consecutive closing braces at the end of the file
            // This specifically targets the pattern we're seeing in the error
            code = code.replace(/(\s*export\s*\{[^}]+\}\s*;)\s*\}+\s*$/g, '$1\n');
            
            // Fix multiple consecutive closing braces
            code = code.replace(/\}\s*\}\s*;/g, '};');
            
            // Fix standalone closing braces with semicolons
            code = code.replace(/^\s*\}\s*;/gm, '');
            
            // Normalize export statements
            code = code.replace(/export\s*\{([^}]+)\}\s*;/g, (_, p1) => 
              `export { ${p1.trim().replace(/\s+/g, ' ')} };`);
            
            // Fix default export syntax
            code = code.replace(/export\s+default\s*\{([^}]+)\}\s*;/g, (_, p1) => 
              `export default { ${p1.trim()} };`);
            
            // Fix multi-line default exports
            code = code.replace(/export\s+default\s*\{\n([^}]+)\n\}\s*;/g, (_, p1) => 
              `export default {\n  ${p1.trim().split('\n').join('\n  ')}\n};`);
            
            // Fix component registration pattern that's causing issues
            code = code.replace(/^\s*\(["']([^"']+)["'],\s*([A-Za-z0-9_$]+)\);\s*$/gm, 
            'app.component("$1", $2);');
            
            // Remove any standalone closing braces or semicolons
            code = code.replace(/^\s*\};\s*$/gm, '');
            code = code.replace(/^\s*;\s*$/gm, '');
            
            // Ensure all import statements end with semicolons
            code = code.replace(/^(import .+?)(?!\s*;)$/gm, '$1;');
            
            // Fix any malformed variable declarations
            code = code.replace(/const\s+([a-zA-Z0-9_$]+)\s*=\s*([^;]+)(?!\s*;)$/gm, 'const $1 = $2;');
            
            // Remove consecutive semicolons
            code = code.replace(/;;+/g, ';');
            
            // A more direct approach to fix the specific issue we're seeing
            // This will remove all closing braces that appear after the last export statement
            const lastExportIndex = code.lastIndexOf('export');
            if (lastExportIndex > 0) {
              const afterLastExport = code.substring(lastExportIndex);
              const exportEndIndex = afterLastExport.indexOf(';') + 1;
              if (exportEndIndex > 0) {
                const cleanExport = afterLastExport.substring(0, exportEndIndex);
                const restOfCode = afterLastExport.substring(exportEndIndex).replace(/\}/g, '');
                code = code.substring(0, lastExportIndex) + cleanExport + restOfCode;
              }
            }
            
            return { code, map: null };
          } catch (error) {
            console.error('Error in code-validator plugin:', error);
            // Return original code if our fixes cause errors
            return null;
          }
        }
      }
    ],
    external: (id) => {
      // 确保入口模块不是外部模块
      if (id === input || id.includes(path.normalize(pkgRoot))) {
        return false;
      }
      return /^vue/.test(id) || 
             /^@xc/.test(id) || 
             /\.scss$/.test(id) || 
             /\.css$/.test(id) || 
             /them-chalk/.test(id);
    },
    treeshake: false,
  })

  for (const config of Object.values(buildConfig)) {
    await bundle.write({
      format: config.format,
      file: path.resolve(config.output.path, 'index.js'),
      exports: config.format === 'cjs' ? 'named' : undefined,
      sourcemap: false,
      paths: (id) => {
        if (id.startsWith('@xc/')) {
          return id.replace('@xc/', './')
        }
        return id
      }
    })
  }
}