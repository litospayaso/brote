import path from 'path';
import process from 'process';
import fs from 'fs';

import { esbuildPlugin } from '@web/dev-server-esbuild';
import { playwrightLauncher } from '@web/test-runner-playwright';
import { defaultReporter } from '@web/test-runner';
import { junitReporter } from '@web/test-runner-junit-reporter';
import { fromRollup } from '@web/dev-server-rollup';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';

const timeout = 8000;

const getLogs = ({ type }) => {
  return type === 'error' || type === 'warning';
};

export default {
  filterBrowserLogs: getLogs,
  files: ['src/components/**/*.test.ts'],
  rootDir: '.',
  port: 6969,
  plugins: [
    fromRollup(typescriptPaths)({
      preserveExtensions: true,
      absolute: false,
      transform(route) {
        return path.join(process.cwd(), route);
      },
    }),
    esbuildPlugin({
      ts: true,
      js: true,
      tsconfig: path.join(process.cwd(), 'tsconfig.json'),
    }),
    {
      name: 'raw-css-loader',
      transform(context) {
        if (context.url.endsWith('.css?raw')) {
          return {
            type: 'js',
          };
        }
      },
      resolveImport({ source }) {
        if (source.endsWith('.css?raw')) {
          return source;
        }
      },
      async serve(context) {
        if (context.url.endsWith('.css?raw')) {
          const filePath = path.join(process.cwd(), context.url.split('?')[0]);
          const content = await fs.promises.readFile(filePath, 'utf-8');
          return {
            body: `export default ${JSON.stringify(content)};`,
            type: 'js',
          };
        }
      },
    },
  ],
  nodeResolve: true,
  testFramework: {
    config: {
      timeout: String(timeout),
    },
  },
  browsers: [
    playwrightLauncher({ product: 'chromium', launchOptions: { timeout } }),
    playwrightLauncher({ product: 'firefox', launchOptions: { timeout } }),
    playwrightLauncher({ product: 'webkit', launchOptions: { timeout } }),
  ],
  reporters: [
    defaultReporter({ reportTestResults: true, reportTestProgress: true }),
    junitReporter({
      outputPath: './test-results.xml',
    }),
  ],
  coverageConfig: {
    report: true,
    reportDir: 'coverage',
    sourcemapInclude: ['src/components/**/*.ts'],
    include: ['src/components/**/*.ts'],
    exclude: [
      'node_modules/**/*',
      'src/shared/**.ts',
    ],
    threshold: {
      statements: 80,
      branches: 70,
      functions: 70,
      lines: 80,
    },
  },
};
