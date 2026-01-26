import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['server/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'esm',
  outfile: 'dist/server/index.js',
  sourcemap: true,
  external: [
    'express',
    'drizzle-orm',
    'pg',
    '@octokit/rest',
    'express-session',
    'passport',
    'passport-local',
    'bcrypt',
    'vite',
    '@babel/*',
    'typescript'
  ],
  loader: {
    '.ts': 'ts',
    '.tsx': 'tsx'
  },
  plugins: []
});
