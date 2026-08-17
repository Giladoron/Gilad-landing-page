import { spawn } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const mondayApiToken = process.env.MONDAY_API_TOKEN;

if (!mondayApiToken) {
  console.error('MONDAY_API_TOKEN build secret is not configured');
  process.exit(1);
}

const tempDirectory = await mkdtemp(join(tmpdir(), 'gilad-lead-intake-'));
const secretsFile = join(tempDirectory, 'secrets.json');

try {
  await writeFile(secretsFile, JSON.stringify({ MONDAY_API_TOKEN: mondayApiToken }), {
    mode: 0o600,
  });

  const childEnvironment = { ...process.env };
  delete childEnvironment.MONDAY_API_TOKEN;

  const wranglerCommand = process.platform === 'win32' ? 'wrangler.cmd' : 'wrangler';
  const exitCode = await new Promise((resolve, reject) => {
    const child = spawn(
      wranglerCommand,
      ['deploy', '--config', 'worker/wrangler.jsonc', '--secrets-file', secretsFile],
      {
        env: childEnvironment,
        stdio: 'inherit',
      }
    );

    child.once('error', reject);
    child.once('exit', (code, signal) => {
      if (signal) {
        reject(new Error(`Wrangler was terminated by ${signal}`));
        return;
      }

      resolve(code ?? 1);
    });
  });

  if (exitCode !== 0) {
    process.exitCode = exitCode;
  }
} finally {
  await rm(tempDirectory, { recursive: true, force: true });
}
