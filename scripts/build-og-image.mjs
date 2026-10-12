import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { BRAND_LOGO_PATH } from './build-brand-assets.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

async function generateOgImage() {
  const width = 1200;
  const height = 630;

  // Primary GN Monogram Logo parameters (top-left)
  // viewBox: 207 223 2243 1811 (center at 1328.5, 1128.5)
  const logoWidth = 68;
  const scale = logoWidth / 2243;
  const logoX = 96 + logoWidth / 2;
  const logoY = 104;
  const tx = logoX - 1328.5 * scale;
  const ty = logoY - 1128.5 * scale;

  // Architectural Brand Watermark on Right Side (Subtle, luxury presence without distracting clutter)
  const watermarkWidth = 460;
  const wmScale = watermarkWidth / 2243;
  const wmX = 920;
  const wmY = 315;
  const wmtx = wmX - 1328.5 * wmScale;
  const wmty = wmY - 1128.5 * wmScale;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <!-- Background: Deep Warm Obsidian Base with Natural Continuous Decay -->
    <radialGradient id="bgCanvas" cx="28%" cy="32%" r="85%">
      <stop offset="0%" stop-color="#16120f" />
      <stop offset="42%" stop-color="#0b0907" />
      <stop offset="80%" stop-color="#050404" />
      <stop offset="100%" stop-color="#020202" />
    </radialGradient>

    <!-- Warm Amber Spotlight around Brand Identity (Full-canvas diffusion, zero geometric cutoffs) -->
    <radialGradient id="ambientLeft" cx="22%" cy="24%" r="48%">
      <stop offset="0%" stop-color="#e07835" stop-opacity="0.18" />
      <stop offset="40%" stop-color="#d97736" stop-opacity="0.07" />
      <stop offset="75%" stop-color="#b55820" stop-opacity="0.01" />
      <stop offset="100%" stop-color="#0b0907" stop-opacity="0" />
    </radialGradient>

    <!-- Right Side Atmospheric Hearth (Motivated subtle glow behind watermark) -->
    <radialGradient id="ambientRight" cx="78%" cy="50%" r="55%">
      <stop offset="0%" stop-color="#e07835" stop-opacity="0.09" />
      <stop offset="45%" stop-color="#8c4516" stop-opacity="0.03" />
      <stop offset="80%" stop-color="#0b0907" stop-opacity="0" />
      <stop offset="100%" stop-color="#0b0907" stop-opacity="0" />
    </radialGradient>

    <!-- Top Horizon Ambient Rim Light (Continuous decay) -->
    <linearGradient id="topRim" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f08a46" stop-opacity="0.14" />
      <stop offset="8%" stop-color="#d97736" stop-opacity="0.04" />
      <stop offset="20%" stop-color="#d97736" stop-opacity="0.01" />
      <stop offset="30%" stop-color="#d97736" stop-opacity="0" />
      <stop offset="100%" stop-color="#d97736" stop-opacity="0" />
    </linearGradient>

    <!-- Flush Edge Perimeter Bezel (Crisp 1px frame for dark social cards) -->
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d97736" stop-opacity="0.45" />
      <stop offset="25%" stop-color="#ffffff" stop-opacity="0.12" />
      <stop offset="75%" stop-color="#ffffff" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#d97736" stop-opacity="0.25" />
    </linearGradient>

    <!-- Title Gradient (Ceramic White to Warm Stone) -->
    <linearGradient id="nameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#eee9e0" />
    </linearGradient>

    <!-- Watermark Gradient -->
    <linearGradient id="wmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f08a46" stop-opacity="0.07" />
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.03" />
      <stop offset="100%" stop-color="#d97736" stop-opacity="0.01" />
    </linearGradient>

    <!-- Primary Logo Glow Filter -->
    <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feColorMatrix type="matrix" values="0 0 0 0 0.95   0 0 0 0 0.5   0 0 0 0 0.25   0 0 0 0.4 0"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <style>
    .font-sans {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Plus Jakarta Sans", "Inter", sans-serif;
    }
    .font-mono {
      font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
    }
  </style>

  <!-- 1. Deep Obsidian Full-Bleed Canvas -->
  <rect width="${width}" height="${height}" fill="url(#bgCanvas)" />

  <!-- 2. Motivated Left Ambient Spotlight -->
  <rect width="${width}" height="${height}" fill="url(#ambientLeft)" />

  <!-- 3. Right Side Atmospheric Hearth -->
  <rect width="${width}" height="${height}" fill="url(#ambientRight)" />

  <!-- 4. Top Horizon Rim Light -->
  <rect width="${width}" height="${height}" fill="url(#topRim)" />

  <!-- 5. Right Side Architectural Brand Watermark (Subtle depth anchor, zero distraction) -->
  <g transform="translate(${wmtx}, ${wmty}) scale(${wmScale})">
    <path fill="url(#wmGrad)" fill-rule="evenodd" d="${BRAND_LOGO_PATH}" />
  </g>

  <!-- 6. Editorial Brand Lockup (Top Bar) -->
  <!-- Canonical GN Brand Tube Monogram -->
  <g transform="translate(${tx}, ${ty}) scale(${scale})" opacity="0.4" filter="url(#logoGlow)">
    <path fill="#f08a46" fill-rule="evenodd" d="${BRAND_LOGO_PATH}" />
  </g>
  <g transform="translate(${tx}, ${ty}) scale(${scale})">
    <path fill="#e27c38" fill-rule="evenodd" d="${BRAND_LOGO_PATH}" />
  </g>

  <!-- Editorial Discipline Tagline next to Monogram -->
  <g transform="translate(186, 107)">
    <circle cx="0" cy="-3.5" r="2.5" fill="#d97736" />
    <text x="12" y="0" class="font-mono" font-size="11.5" font-weight="600" letter-spacing="0.16em" fill="#a8a196">FULL-STACK &amp; MOBILE</text>
  </g>

  <!-- Status / Verification Indicator (Top Right) -->
  <g transform="translate(1104, 107)" text-anchor="end">
    <circle cx="-168" cy="-3.5" r="3" fill="#22c55e" />
    <text x="-154" y="0" class="font-mono" font-size="11" font-weight="500" letter-spacing="0.08em" fill="#8c857b" text-anchor="start">AVAILABLE FOR PROJECTS</text>
  </g>

  <!-- 7. Primary Headline: Name with Confident Editorial Typography -->
  <text x="96" y="252" class="font-sans" font-size="62" font-weight="700" letter-spacing="-0.03em" fill="url(#nameGrad)">Ghufron Ainun Najib</text>

  <!-- 8. Value Proposition: Specific, Clean, High Contrast -->
  <text x="96" y="312" class="font-sans" font-size="24" font-weight="400" fill="#ded8cc" letter-spacing="-0.01em">Software Engineer · Web &amp; Mobile Products</text>

  <!-- 9. Quiet Tech Stack Proof (Clean Editorial Mono) -->
  <text x="96" y="374" class="font-mono" font-size="13" font-weight="500" fill="#9e978d" letter-spacing="0.14em">FLUTTER · TYPESCRIPT · REACT · NODE.JS · SUPABASE · POSTGRESQL</text>

  <!-- 10. Structural Hairline Separator -->
  <line x1="96" y1="456" x2="1104" y2="456" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />

  <!-- 11. Editorial Signature Footer -->
  <!-- Verified Domain -->
  <g transform="translate(96, 520)">
    <circle cx="0" cy="-4.5" r="3.5" fill="#d97736" />
    <text x="14" y="0" class="font-mono" font-size="13.5" font-weight="600" letter-spacing="0.04em" fill="#f08a46">ghufronainun.tech</text>
  </g>

  <!-- Context Proof -->
  <g transform="translate(460, 520)">
    <text x="0" y="0" class="font-mono" font-size="12.5" font-weight="400" letter-spacing="0.06em" fill="#8c857b">Portfolio &amp; Case Studies</text>
  </g>

  <!-- Craft / Location Note (Right Aligned) -->
  <g transform="translate(1104, 520)" text-anchor="end">
    <text x="0" y="0" class="font-mono" font-size="12" font-weight="400" letter-spacing="0.06em" fill="#6e675e">Semarang, Indonesia</text>
  </g>

  <!-- 12. Flush 1px Edge Perimeter Bezel (Zero floating box, fits social cards natively) -->
  <rect x="0.5" y="0.5" width="1199" height="629" fill="none" stroke="url(#borderGrad)" stroke-width="1" />
</svg>`;

  const outPath = resolve(root, 'public/og-image.png');
  const buffer = Buffer.from(svg);

  await sharp(buffer)
    .resize(width, height)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(outPath);

  console.log(`✓ Generated Clean Minimal Editorial OG Image (No Photo) -> public/og-image.png`);
}

generateOgImage().catch(console.error);
