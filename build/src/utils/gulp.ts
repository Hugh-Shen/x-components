import { resolve } from 'path'
import { buildOutput, projRoot } from './paths'
import type { TaskFunction } from 'gulp'

// 创建带名称的任务
export const withTaskName = <T extends TaskFunction>(name: string, fn: T) => {
  Object.defineProperty(fn, 'name', { value: name })
  return fn
}

// 路径重写
export const pathRewriter = (format: string) => {
  return (id: string) => {
    return id.replace('@xc', `x-components/${format}`)
  }
}