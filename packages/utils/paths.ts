import path from 'path'

export const rootPath = path.resolve(__dirname, '../../')

export const resolvePath = (dir: string) => path.resolve(rootPath, dir)