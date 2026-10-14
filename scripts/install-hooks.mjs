import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function gitOutput(args) {
  const result = spawnSync('git', args, { encoding: 'utf8' });
  return result.status === 0 ? result.stdout.trim() : '';
}

function hasActiveHooks(directory) {
  if (!existsSync(directory)) return false;
  return readdirSync(directory).some((name) => {
    if (name.endsWith('.sample')) return false;
    const file = statSync(join(directory, name));
    return file.isFile() && (file.mode & 0o111) !== 0;
  });
}

function installHooks() {
  if (process.env.CI || !gitOutput(['rev-parse', '--git-dir'])) return;
  const existing = gitOutput(['config', '--get', 'core.hooksPath']);
  if (existing === '.githooks') return;
  const defaultHooks = gitOutput(['rev-parse', '--git-path', 'hooks']);
  if (existing || hasActiveHooks(defaultHooks)) {
    console.info(
      'Keeping existing Git hooks. Integrate mise run verify before committing.',
    );
    return;
  }

  const result = spawnSync(
    'git',
    ['config', '--local', 'core.hooksPath', '.githooks'],
    { stdio: 'inherit' },
  );
  if (result.status !== 0) process.exitCode = 1;
}

installHooks();
