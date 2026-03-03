import fs from 'fs';
['android/app/capacitor.build.gradle', 'node_modules/@capacitor/android/capacitor/build.gradle'].forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/JavaVersion\.VERSION_21/g, 'JavaVersion.VERSION_17');
    fs.writeFileSync(file, content);
  }
});
