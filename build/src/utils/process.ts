import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

// 运行命令
export const run = async (command: string, args: string[]) => {
  // 在 Windows 上替换 cp 命令为 copy 或 xcopy
  if (process.platform === 'win32' && command === 'cp') {
    return copyFiles(args)
  }

  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      stdio: 'inherit',
      shell: process.platform === 'win32',
    })

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed: ${command} ${args.join(' ')}`))
        return
      }
      resolve()
    })
  })
}

// Windows 上的文件复制函数
const copyFiles = async (args: string[]) => {
  // 处理 cp -r source dest 格式的命令
  const isRecursive = args[0] === '-r'
  const srcIndex = isRecursive ? 1 : 0
  const destIndex = isRecursive ? 2 : 1
  
  const src = args[srcIndex]
  const dest = args[destIndex]
  
  // 确保目标目录存在
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  
  if (isRecursive && fs.statSync(src).isDirectory()) {
    // 递归复制目录
    copyDirRecursive(src, dest)
  } else {
    // 复制单个文件
    fs.copyFileSync(src, dest)
  }
}

// 递归复制目录
const copyDirRecursive = (src: string, dest: string) => {
  // 创建目标目录
  fs.mkdirSync(dest, { recursive: true })
  
  // 读取源目录内容
  const entries = fs.readdirSync(src, { withFileTypes: true })
  
  // 复制每个条目
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    
    if (entry.isDirectory()) {
      // 递归复制子目录
      copyDirRecursive(srcPath, destPath)
    } else {
      // 复制文件
      fs.copyFileSync(srcPath, destPath)
    }
  }
}