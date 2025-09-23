import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Icon sizes needed for PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Paths
const inputPath = path.join(__dirname, '..', 'public', 'icons', 'base-icon.png');
const outputDir = path.join(__dirname, '..', 'public', 'icons');

async function generateIcons() {
  try {
    // Check if base icon exists
    if (!fs.existsSync(inputPath)) {
      console.error('Base icon not found at:', inputPath);
      return;
    }

    console.log('Generating PWA icons from base-icon.png...');
    console.log('Input:', inputPath);
    console.log('Output directory:', outputDir);

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Read the base icon to get its dimensions
    const metadata = await sharp(inputPath).metadata();
    console.log(`Base icon dimensions: ${metadata.width}x${metadata.height}`);

    // Generate each icon size
    for (const size of iconSizes) {
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);

      await sharp(inputPath)
        .resize(size, size, {
          kernel: sharp.kernel.lanczos3,
          fit: 'cover'
        })
        .png({
          quality: 90,
          compressionLevel: 6
        })
        .toFile(outputPath);

      console.log(`✓ Generated: icon-${size}x${size}.png`);
    }

    // Also generate the special shortcut icons if they don't exist
    const shortcuts = [
      { name: 'scale-96x96.png', emoji: '⚖️', text: 'Paino' },
      { name: 'food-96x96.png', emoji: '🍽️', text: 'Ruoka' },
      { name: 'book-96x96.png', emoji: '📖', text: 'Kirja' }
    ];

    console.log('\nChecking shortcut icons...');
    for (const shortcut of shortcuts) {
      const shortcutPath = path.join(outputDir, shortcut.name);
      if (!fs.existsSync(shortcutPath)) {
        // For now, just copy the main icon - you can customize these later
        await sharp(inputPath)
          .resize(96, 96, {
            kernel: sharp.kernel.lanczos3,
            fit: 'cover'
          })
          .png({
            quality: 90,
            compressionLevel: 6
          })
          .toFile(shortcutPath);

        console.log(`✓ Generated placeholder: ${shortcut.name}`);
      } else {
        console.log(`- Already exists: ${shortcut.name}`);
      }
    }

    console.log('\n🎉 Icon generation complete!');
    console.log(`Generated ${iconSizes.length} PWA icons in sizes: ${iconSizes.join(', ')}`);

  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

// Run the script
generateIcons();