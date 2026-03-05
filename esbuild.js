import { build } from 'esbuild';
import { glob } from 'glob';
import camelcase from 'camelcase';
import fs from 'fs';
import litPlugin from 'esbuild-plugin-lit';
import { exec } from 'node:child_process';

const outDir = 'dist';
let finalVersion = '0.0.0';

if (fs.existsSync('./dist')) {
  fs.rm('./dist', { recursive: true }, () => { });
}

const gzip = async folder => {
  return new Promise((resolve, reject) => {
    exec(`npm pack ${folder} --pack-destination="${folder}"`, (err, stdout) => {
      if (err) {
        console.log('\x1b[31m%s\x1b[36m%s\x1b[0m', 'ERROR   ', `${err}`);
        reject();
      } else {
        resolve(stdout);
      }
    });
  });
};

const asyncForEach = async (array, callback) => {
  for (let index = 0;index < array.length;index++) {
    await callback(array[index], index, array);
  }
};


await asyncForEach(glob.sync('./src/components/**/index.ts'), async file => {
  file = file.replace(/\\/g, '/')
  const componentPath = file.replace('/index.ts', '');
  let packageJson = fs.readFileSync(`${componentPath}/package.json`);
  packageJson = JSON.parse(packageJson);
  const version = packageJson && packageJson.version ? `${packageJson.version}` : '';

  const componentName = camelcase(file.split('/').at(-2));
  const outDist = file
    .replace('src', outDir)
    .replace('index.ts', '')
    .concat(version ? version : '');
  console.log('\x1b[32m%s', '\n-----------------------------');
  console.log('\x1b[32m%s\x1b[36m%s\x1b[0m', '[component]: ', componentName);

  if (componentName === 'pageBroteApp') {
    finalVersion = version;
  }

  await build({
    entryPoints: [`${componentPath}/index.ts`],
    bundle: true,
    minify: false,
    platform: !file.includes('rooster') || !file.includes('lexical') ? 'browser' : 'neutral',
    outfile: `${outDist}/${componentName}.js`,
    plugins: [litPlugin()],
  });

  console.log('\x1b[32m%s\x1b[36m%s\x1b[0m', '[build]:     ', `${outDist}/${componentName}.js`);

  await build({
    entryPoints: [`${componentPath}/index.ts`],
    bundle: true,
    minify: true,
    outfile: `${outDist}/${componentName}.dist.js`,
    platform: !file.includes('rooster') || !file.includes('lexical') ? 'browser' : 'neutral',
    plugins: [litPlugin()],
  });

  console.log(
    '\x1b[32m%s\x1b[36m%s\x1b[0m',
    '[dist]:      ',
    `${outDist}/${componentName}.dist.js`
  );

  await fs.copyFileSync(`${componentPath}/README.md`, `${outDist}/README.md`);

  console.log('\x1b[32m%s\x1b[36m%s\x1b[0m', '[readme]:    ', `${outDist}/README.md`);

  await fs.copyFileSync(`${componentPath}/package.json`, `${outDist}/package.json`);

  console.log('\x1b[32m%s\x1b[36m%s\x1b[0m', '[package]:   ', `${outDist}/package.json`);

  const zip = await gzip(outDist);

  console.log('\x1b[32m%s\x1b[36m%s\x1b[0m', '[gzip]:      ', zip);
  console.log('\x1b[32m%s\x1b[0m', '-----------------------------');
});


fs.copyFile(`./dist/components/pageBroteApp/${finalVersion}/pageBroteApp.js`, './gh-pages/pageBroteApp.js', err => {
  if (err) {
    console.log('\x1b[32m%s\x1b[0m', '\n-----------------------------');
    console.log('\x1b[32m%s\x1b[36m%s\x1b[0m', '[ERROR]:      ', err);
    console.log('\x1b[32m%s\x1b[0m', '-----------------------------');
  } else {
    console.log('\x1b[32m%s\x1b[0m', '\n-----------------------------');
    console.log('\x1b[32m%s\x1b[36m%s\x1b[0m', '[pageBroteApp.js]:      ', ' Lib copy correctly!');
    console.log('\x1b[32m%s\x1b[0m', '-----------------------------');
  }
});


