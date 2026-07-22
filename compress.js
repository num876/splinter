const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function processImage(inputPath, outputPath, options) {
  try {
    if (!fs.existsSync(inputPath)) return;
    await sharp(inputPath)
      .resize(options.width, options.height, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 75 })
      .toFile(outputPath);
    console.log(`Processed ${inputPath}`);
    
    // Replace original
    fs.renameSync(outputPath, inputPath);
  } catch (e) {
    console.error(`Error on ${inputPath}:`, e);
  }
}

async function main() {
  const publicDir = path.join(__dirname, 'public');
  
  await processImage(path.join(publicDir, 'logo.jpg'), path.join(publicDir, 'logo.min.jpg'), { width: 128, height: 128 });
  await processImage(path.join(publicDir, 'favicon.jpg'), path.join(publicDir, 'favicon.min.jpg'), { width: 32, height: 32 });
  
  const imagesDir = path.join(publicDir, 'images');
  if (fs.existsSync(imagesDir)) {
    const files = fs.readdirSync(imagesDir).filter(f => f.endsWith('.jpg') && !f.endsWith('.min.jpg'));
    for (const f of files) {
      await processImage(path.join(imagesDir, f), path.join(imagesDir, f.replace('.jpg', '.min.jpg')), { width: 800, height: 800 });
    }
  }
}

main();
