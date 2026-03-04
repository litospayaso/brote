import fs from 'fs';
import path from 'path';

function findAndFixBuildGradle(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findAndFixBuildGradle(fullPath);
    } else if (file === 'build.gradle' || file === 'capacitor.build.gradle') {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('JavaVersion.VERSION_21')) {
        console.log(`Fixing Java version in ${fullPath}`);
        content = content.replace(/JavaVersion\.VERSION_21/g, 'JavaVersion.VERSION_17');
        fs.writeFileSync(fullPath, content);
      }
    }
  });
}

['android', 'node_modules/@capacitor'].forEach(dir => findAndFixBuildGradle(dir));
