import * as esbuild from 'esbuild';

const isProduction = process.env.NODE_ENV === 'production';

await esbuild.build({
  entryPoints: ['server/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'esm',
  outfile: 'dist/server/index.js',
  sourcemap: !isProduction, // Disable source maps in production
  minify: isProduction, // Minify in production
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
    'typescript',
    'jose',
    'express-rate-limit',
    'cors',
    // vite-plugin-checker optional deps
    'stylelint',
    'meow',
    'vls',
    'vite-plugin-checker'
  ],
  loader: {
    '.ts': 'ts',
    '.tsx': 'tsx'
  },
  plugins: [],
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }
});
