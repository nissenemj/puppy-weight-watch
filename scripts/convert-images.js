#!/usr/bin/env node

/**
 * Image Optimization Script
 *
 * Converts images to modern formats (AVIF, WebP) with multiple sizes
 * for optimal performance and responsive images.
 *
 * Usage: node scripts/convert-images.js
 */

import sharp from 'sharp';
import { readdir, mkdir, stat } from 'fs/promises';
import { join, parse, relative } from 'path';
import { existsSync } from 'fs';

// Configuration
const SIZES = {
  small: 640,
  medium: 1024,
  large: 1920,
};

const FORMATS = ['avif', 'webp', 'jpg'];

const QUALITY = {
  avif: 60,  // AVIF has excellent compression at lower quality
  webp: 75,  // WebP good quality
  jpg: 85,   // JPG needs higher quality
};

const INPUT_DIR = join(process.cwd(), 'src', 'assets');
const OUTPUT_DIR = join(process.cwd(), 'public', 'images');

// Images to skip (icons, logos that should stay as-is)
const SKIP_PATTERNS = [
  'app-icon',
  'paw-icon',
  'puppy-logo',
  'puppy-book-icon',
];

// Images to process (hero images, backgrounds, large images)
const PRIORITY_IMAGES = [
  'pentulaskuri-hero.png',
  'hero-puppy-cartoon.jpg',
  'hero-main-illustration.png',
  'hero-puppy-new.jpg',
  'growth-chart-hero.png',
  'calculator-hero-bg.jpg',
  'dogscale.jpg',
];

/**
 * Check if file should be skipped
 */
function shouldSkip(filename) {
  const basename = parse(filename).name;

  // Skip SVG files
  if (filename.endsWith('.svg')) {
    return true;
  }

  // Skip small icons/logos
  if (SKIP_PATTERNS.some(pattern => basename.includes(pattern))) {
    return true;
  }

  return false;
}

/**
 * Check if file is a priority image
 */
function isPriority(filename) {
  return PRIORITY_IMAGES.includes(parse(filename).base);
}

/**
 * Get all image files recursively
 */
async function getImageFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...await getImageFiles(fullPath));
    } else if (entry.isFile() && /\.(png|jpe?g)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Convert single image to multiple formats and sizes
 */
async function convertImage(inputPath) {
  const { name, ext } = parse(inputPath);
  const relativePath = relative(INPUT_DIR, inputPath);
  const relativeDir = parse(relativePath).dir;

  console.log(`\n📸 Processing: ${relativePath}`);

  try {
    // Get original dimensions
    const metadata = await sharp(inputPath).metadata();
    const { width: originalWidth, height: originalHeight } = metadata;

    console.log(`   Original: ${originalWidth}x${originalHeight}`);

    // Process each size
    for (const [sizeName, targetWidth] of Object.entries(SIZES)) {
      // Skip if original is smaller than target
      if (originalWidth < targetWidth && sizeName !== 'small') {
        console.log(`   ⏭️  Skipping ${sizeName} (original is smaller)`);
        continue;
      }

      const actualWidth = Math.min(targetWidth, originalWidth);

      // Process each format
      for (const format of FORMATS) {
        const outputDir = join(OUTPUT_DIR, relativeDir);

        // Create output directory if needed
        if (!existsSync(outputDir)) {
          await mkdir(outputDir, { recursive: true });
        }

        const outputFilename = `${name}-${sizeName}.${format}`;
        const outputPath = join(outputDir, outputFilename);

        try {
          const pipeline = sharp(inputPath)
            .resize(actualWidth, null, {
              withoutEnlargement: true,
              fit: 'inside',
            });

          // Apply format-specific options
          switch (format) {
            case 'avif':
              pipeline.avif({ quality: QUALITY.avif, effort: 6 });
              break;
            case 'webp':
              pipeline.webp({ quality: QUALITY.webp, effort: 4 });
              break;
            case 'jpg':
              pipeline.jpeg({ quality: QUALITY.jpg, progressive: true, mozjpeg: true });
              break;
          }

          await pipeline.toFile(outputPath);

          const stats = await stat(outputPath);
          const sizeKB = (stats.size / 1024).toFixed(1);
          console.log(`   ✅ ${sizeName}/${format}: ${actualWidth}w (${sizeKB}KB)`);
        } catch (err) {
          console.error(`   ❌ Failed ${sizeName}/${format}:`, err.message);
        }
      }
    }
  } catch (err) {
    console.error(`   ❌ Failed to process:`, err.message);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🖼️  Image Optimization Script');
  console.log('================================\n');
  console.log(`📂 Input:  ${INPUT_DIR}`);
  console.log(`📂 Output: ${OUTPUT_DIR}\n`);
  console.log(`📐 Sizes:  ${Object.entries(SIZES).map(([k, v]) => `${k} (${v}w)`).join(', ')}`);
  console.log(`🎨 Formats: ${FORMATS.join(', ')}\n`);

  try {
    // Get all images
    const imageFiles = await getImageFiles(INPUT_DIR);
    console.log(`Found ${imageFiles.length} images\n`);

    // Separate priority and regular images
    const priorityImages = imageFiles.filter(f => isPriority(parse(f).base));
    const regularImages = imageFiles.filter(f => !shouldSkip(parse(f).base) && !isPriority(parse(f).base));
    const skippedImages = imageFiles.filter(f => shouldSkip(parse(f).base));

    console.log(`⭐ Priority: ${priorityImages.length}`);
    console.log(`📄 Regular: ${regularImages.length}`);
    console.log(`⏭️  Skipped: ${skippedImages.length}\n`);

    if (skippedImages.length > 0) {
      console.log('Skipped files (icons/logos/SVGs):');
      skippedImages.forEach(f => console.log(`   - ${relative(INPUT_DIR, f)}`));
    }

    // Process priority images first
    console.log('\n⭐ PROCESSING PRIORITY IMAGES');
    console.log('================================');
    for (const imagePath of priorityImages) {
      await convertImage(imagePath);
    }

    // Process regular images
    console.log('\n📄 PROCESSING REGULAR IMAGES');
    console.log('================================');
    for (const imagePath of regularImages) {
      await convertImage(imagePath);
    }

    console.log('\n✅ Image optimization complete!');
    console.log(`\n📊 Summary:`);
    console.log(`   Processed: ${priorityImages.length + regularImages.length} images`);
    console.log(`   Skipped: ${skippedImages.length} images`);
    console.log(`   Output: ${OUTPUT_DIR}`);

  } catch (err) {
    console.error('\n❌ Error:', err);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
