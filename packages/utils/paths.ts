import path from 'path'

export const rootPath = path.resolve(__dirname, '../../')

export const rootResolvePath = (dir: string) => path.resolve(rootPath, dir)