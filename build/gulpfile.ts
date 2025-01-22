import { series, parallel } from 'gulp'
import { withTashName, run } from './index'

export default series(
  withTashName('clear', async () => run('rm -rf ./dist')),
  withTashName('build', async () => run('pnpm run --filter ./packages/them-chalk build')),
)