const { readdirSync } = require('node:fs');

const features = readdirSync('src/features', { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

module.exports = {
  forbidden: [
    { name: 'no-cycles', severity: 'error', from: {}, to: { circular: true } },
    {
      name: 'no-unresolved-imports',
      severity: 'error',
      from: {},
      to: { couldNotResolve: true },
    },
    {
      name: 'app-is-composition-root',
      severity: 'error',
      from: { pathNot: '^src/app/' },
      to: { path: '^src/app/' },
    },
    {
      name: 'shared-has-no-feature-owner',
      severity: 'error',
      from: { path: '^src/shared/' },
      to: { path: '^src/(?!shared/)' },
    },
    {
      name: 'production-does-not-import-tests',
      severity: 'error',
      from: { pathNot: '\\.(test|spec)\\.tsx?$' },
      to: { path: '\\.(test|spec)\\.tsx?$' },
    },
    ...features.map((feature) => ({
      name: `${feature}-public-api`,
      severity: 'error',
      from: { pathNot: `^src/features/${feature}/` },
      to: { path: `^src/features/${feature}/(?!index\\.ts$)` },
    })),
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsConfig: { fileName: 'tsconfig.app.json' },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      extensions: ['.ts', '.tsx', '.js', '.json', '.css'],
    },
  },
};
