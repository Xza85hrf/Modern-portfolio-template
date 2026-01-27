import * as esbuild from 'esbuild';

const isProduction = process.env.NODE_ENV === 'production';

await esbuild.build({
  entryPoints: ['api/index.source.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'esm',
  outfile: 'api/index.js',
  sourcemap: false,
  minify: isProduction,
  external: [
    // Node.js built-ins that should remain external
    'fs',
    'path',
    'crypto',
    'url',
    'stream',
    'http',
    'https',
    'net',
    'tls',
    'zlib',
    'events',
    'buffer',
    'util',
    'os',
    'querystring',
    'string_decoder',
    'child_process',
    // Keep native modules external
    'bcrypt',
    // Keep @neondatabase serverless (uses fetch which is available in runtime)
  ],
  loader: {
    '.ts': 'ts',
  },
  banner: {
    js: `
// Bundled API for Vercel serverless
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
`.trim()
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  }
});

console.log('API bundled successfully!');
