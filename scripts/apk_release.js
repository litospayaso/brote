import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const isWindows = process.platform === 'win32';
const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
const version = packageJson.version;

function run(command, cwd = rootDir) {
  console.log(`Executing: ${command}`);
  execSync(command, { stdio: 'inherit', cwd });
}

try {
  run('npx cap sync');
  run('node scripts/fix_java_version.js');

  const androidDir = path.join(rootDir, 'android');
  let buildCmd;

  if (isWindows) {
    buildCmd = 'gradlew.bat assembleDebug';
  } else {
    run('chmod +x gradlew', androidDir);
    const sdkPath = path.join(process.env.HOME, 'Android', 'Sdk');
    if (fs.existsSync(sdkPath)) {
      buildCmd = `ANDROID_HOME=${sdkPath} ./gradlew assembleDebug`;
    } else {
      buildCmd = './gradlew assembleDebug';
    }
  }

  run(buildCmd, androidDir);

  const releasesDir = path.join(rootDir, 'releases');
  if (!fs.existsSync(releasesDir)) {
    fs.mkdirSync(releasesDir);
  }

  const sourceApk = path.join(androidDir, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
  const destApk = path.join(releasesDir, `Brote-release_${version}.apk`);

  if (fs.existsSync(sourceApk)) {
    fs.copyFileSync(sourceApk, destApk);
    console.log(`\n✨ APK successfully copied to: ${destApk}\n`);
  } else {
    console.error(`\n❌ Could not find source APK at: ${sourceApk}\n`);
    process.exit(1);
  }

} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}
