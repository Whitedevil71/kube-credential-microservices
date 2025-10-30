// Safe postinstall: only run tsc if tsconfig and src exist
const { existsSync } = require('fs');
const { spawnSync } = require('child_process');

if (existsSync('./tsconfig.json') && existsSync('./src')) {
  const result = spawnSync('npm', ['run', 'build'], { stdio: 'inherit', shell: true });
  if (result.status !== 0) {
    console.error('Postinstall build failed');
    process.exit(result.status || 1);
  }
} else {
  console.log('Skipping postinstall build: tsconfig.json or src not found');
}
