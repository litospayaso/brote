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
      let originalContent = content;

      content = content.replace(/JavaVersion\.VERSION_21/g, 'JavaVersion.VERSION_17');
      content = content.replace(/JavaVersion\.VERSION_1_8/g, 'JavaVersion.VERSION_17');
      content = content.replace(/jvmTarget\s*=\s*['"]?21['"]?/g, "jvmTarget = '17'");
      content = content.replace(/jvmTarget\s*=\s*['"]?1\.8['"]?/g, "jvmTarget = '17'");
      content = content.replace(/jvmToolchain\(21\)/g, 'jvmToolchain(17)');

      if (content !== originalContent) {
        console.log(`Fixing Java version in ${fullPath}`);
        fs.writeFileSync(fullPath, content);
      }
    }
  });
}

['android', 'node_modules/@capacitor'].forEach(dir => findAndFixBuildGradle(dir));
