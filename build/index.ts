import { spawn } from 'child_process'
import { rootPath } from '@xc/utils/paths'

export const withTashName = (name: string, fn: any) => {
  return Object.assign(fn, { displayName: name })
}

export const run = (commade: string) => {
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = commade.split(' ')

    const proc = spawn(cmd, args, {
      cwd: rootPath,
      stdio: 'inherit',
      shell: true
    })
    proc.on('close', resolve)
    proc.on('error', reject)
  })
}