const fs = require('fs');
const path = require('path');

const dir = path.resolve('C:/Users/Ashraf/Desktop/ML_CP/frontend/src/components/v0_ui');

function processDir(d) {
  const entries = fs.readdirSync(d, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(d, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('@/components/v0_ui/v0_ui/')) {
        content = content.replace(/@\/components\/v0_ui\/v0_ui\//g, '@/components/v0_ui/');
        fs.writeFileSync(fullPath, content);
        console.log('Fixed', entry.name);
      }
    }
  }
}

processDir(dir);
