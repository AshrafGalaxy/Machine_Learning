const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const srcDir = path.resolve('C:/Users/Ashraf/Desktop/ML_CP/front/components');
const outDir = path.resolve('C:/Users/Ashraf/Desktop/ML_CP/frontend/src/components/v0_ui');

async function processDir(inDir, outDir) {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  
  const entries = fs.readdirSync(inDir, { withFileTypes: true });
  for (const entry of entries) {
    const inPath = path.join(inDir, entry.name);
    if (entry.isDirectory()) {
      await processDir(inPath, path.join(outDir, entry.name));
    } else if (inPath.endsWith('.tsx') || inPath.endsWith('.ts')) {
      const isTsx = inPath.endsWith('.tsx');
      let outPath = path.join(outDir, entry.name.replace(/\.tsx?$/, isTsx ? '.jsx' : '.js'));
      let source = fs.readFileSync(inPath, 'utf8');
      
      // Some next.js specific things to swap:
      source = source.replace(/@\/components\/ui/g, '@/components/v0_ui/ui');
      source = source.replace(/@\/components\//g, '@/components/v0_ui/');
      source = source.replace(/@\/lib\//g, '@/lib/');
      
      // Transform Typescript to JS/JSX
      const result = await esbuild.transform(source, {
        loader: isTsx ? 'tsx' : 'ts',
        jsx: 'preserve',
      });
      
      fs.writeFileSync(outPath, result.code);
    }
  }
}

async function main() {
  await processDir(srcDir, outDir);
  
  // also process lib/utils.ts
  const libSrc = path.resolve('C:/Users/Ashraf/Desktop/ML_CP/front/lib/utils.ts');
  const libOutDir = path.resolve('C:/Users/Ashraf/Desktop/ML_CP/frontend/src/lib');
  if (!fs.existsSync(libOutDir)) fs.mkdirSync(libOutDir, { recursive: true });
  
  let source = fs.readFileSync(libSrc, 'utf8');
  const result = await esbuild.transform(source, { loader: 'ts' });
  fs.writeFileSync(path.join(libOutDir, 'utils.js'), result.code);
  console.log('Conversion complete!');
}

main().catch(console.error);
