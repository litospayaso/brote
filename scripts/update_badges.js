import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const readmePath = path.join(rootDir, 'README.md');

function getTestSuccess() {
  console.log('Reading test results...');
  const xmlPath = path.join(rootDir, 'test-results.xml');
  if (!fs.existsSync(xmlPath)) {
    console.warn('test-results.xml not found. Assuming tests failed.');
    return false;
  }
  const xml = fs.readFileSync(xmlPath, 'utf8');
  const fails = [...xml.matchAll(/failures="(\d+)"/g)].map(m => parseInt(m[1], 10));
  const errs = [...xml.matchAll(/errors="(\d+)"/g)].map(m => parseInt(m[1], 10));
  const totalFails = fails.reduce((a, b) => a + b, 0);
  const totalErrs = errs.reduce((a, b) => a + b, 0);
  return totalFails === 0 && totalErrs === 0;
}

function getCoverage() {
  console.log('Reading code coverage...');
  const lcovPath = path.join(rootDir, 'coverage', 'lcov.info');
  if (!fs.existsSync(lcovPath)) {
    console.warn('coverage/lcov.info not found. Cannot determine coverage.');
    return null;
  }
  const lcov = fs.readFileSync(lcovPath, 'utf8');
  let lf = 0;
  let lh = 0;
  for (const m of lcov.matchAll(/^LF:(\d+)$/gm)) lf += parseInt(m[1], 10);
  for (const m of lcov.matchAll(/^LH:(\d+)$/gm)) lh += parseInt(m[1], 10);
  if (lf === 0) return 0;
  return Math.round((lh / lf) * 100);
}

function getAppVersion() {
  const pkgPath = path.join(rootDir, 'package.json');
  if (!fs.existsSync(pkgPath)) return 'unknown';
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  return pkg.version || 'unknown';
}

function updateReadme(success, coverage, version) {
  if (!fs.existsSync(readmePath)) {
    console.error('README.md not found');
    return;
  }

  let readmeParams = fs.readFileSync(readmePath, 'utf8');

  // Test Badge URL
  const testBadgeColor = success ? 'brightgreen' : 'red';
  const testBadgeText = success ? 'passing' : 'failing';
  const testBadgeUrl = `https://img.shields.io/badge/test_core-${testBadgeText}-${testBadgeColor}`;
  
  // Coverage Badge URL
  let coverageBadgeUrl = '';
  if (coverage !== null) {
    let covColor = 'red';
    if (coverage >= 80) covColor = 'brightgreen';
    else if (coverage >= 60) covColor = 'yellow';
    else if (coverage >= 40) covColor = 'orange';

    coverageBadgeUrl = `https://img.shields.io/badge/coverage-${coverage}%25-${covColor}`;
  } else {
    coverageBadgeUrl = `https://img.shields.io/badge/coverage-unknown-lightgrey`;
  }

  // Version Badge URL
  const versionBadgeUrl = `https://img.shields.io/badge/version-${version}-blue`;

  const badgesMarkdown = `![version](${versionBadgeUrl}) ![test core](${testBadgeUrl}) ![coverage](${coverageBadgeUrl})`;

  const startTag = '<!-- BADGES_START -->';
  const endTag = '<!-- BADGES_END -->';

  const startIndex = readmeParams.indexOf(startTag);
  const endIndex = readmeParams.indexOf(endTag);

  if (startIndex !== -1 && endIndex !== -1) {
    // We include the start tag, a newline, the badges, a newline, and the end tag.
    const before = readmeParams.substring(0, startIndex + startTag.length);
    const after = readmeParams.substring(endIndex);
    const newReadme = `${before}\n${badgesMarkdown}\n${after}`;
    fs.writeFileSync(readmePath, newReadme, 'utf8');
    console.log('Successfully updated README.md badges.');
  } else {
    console.warn(`Badge tags ${startTag} and ${endTag} not found in README.md`);
  }
}

function main() {
  const success = getTestSuccess();
  const coverage = getCoverage();
  const version = getAppVersion();
  updateReadme(success, coverage, version);
  // Always exit with 0 so we don't block downstream processes
  process.exit(0);
}

main();
