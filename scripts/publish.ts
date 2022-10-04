import { execSync } from 'child_process'

let command = 'pnpm publish --access public --no-git-checks'

execSync(command, { stdio: 'inherit' })
