/**
 * Resize + compress landing page category images to AVIF, WebP, and JPEG.
 *
 * Usage: npm run optimize-images
 *
 * Reads originals from public/assets/images/ (Film.jpeg, Photography.jpeg, etc.)
 * Writes Film.avif, Film.webp, Film.jpg (and same for each card).
 */

import { existsSync } from 'node:fs'
import { readFile, stat } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const imagesDir = join(__dirname, '../public/assets/images')

const MAX_WIDTH = 1920
const JPEG_QUALITY = 80
const WEBP_QUALITY = 80
const AVIF_QUALITY = 55

/** Base name -> possible source filenames (first match wins) */
const IMAGES = {
  Film: ['Film.jpeg', 'Film.jpg'],
  Photography: ['Photography.jpeg', 'Photography.jpg'],
  MusicVideo: ['MusicVideo.jpg', 'MusicVideo.jpeg'],
  Design: ['Design.jpg', 'Design.jpeg'],
  CommercialPromo: ['CommercialPromo.jpg', 'CommercialPromo.jpeg', 'CommercialPromo.png'],
}

function findSource(base, candidates) {
  for (const name of candidates) {
    const path = join(imagesDir, name)
    if (existsSync(path)) return path
  }
  return null
}

async function optimizeOne(base, candidates) {
  const source = findSource(base, candidates)
  if (!source) {
    console.warn(`  skip ${base}: no source found (${candidates.join(', ')})`)
    return
  }

  const sourceBuffer = await readFile(source)
  const pipeline = sharp(sourceBuffer).resize({
    width: MAX_WIDTH,
    withoutEnlargement: true,
  })

  const avifPath = join(imagesDir, `${base}.avif`)
  const webpPath = join(imagesDir, `${base}.webp`)
  const jpgPath = join(imagesDir, `${base}.jpg`)

  await pipeline.clone().avif({ quality: AVIF_QUALITY }).toFile(avifPath)
  await pipeline.clone().webp({ quality: WEBP_QUALITY }).toFile(webpPath)
  await pipeline.clone().jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(jpgPath)

  const [meta, avifKb, webpKb, jpgKb] = await Promise.all([
    sharp(jpgPath).metadata(),
    stat(avifPath).then((s) => s.size),
    stat(webpPath).then((s) => s.size),
    stat(jpgPath).then((s) => s.size),
  ])

  console.log(
    `  ${base}: ${meta.width}px → avif ${(avifKb / 1024).toFixed(0)}KB, webp ${(webpKb / 1024).toFixed(0)}KB, jpg ${(jpgKb / 1024).toFixed(0)}KB`
  )
}

console.log('Optimizing landing page images...\n')

for (const [base, candidates] of Object.entries(IMAGES)) {
  await optimizeOne(base, candidates)
}

console.log('\nDone.')
