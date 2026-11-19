import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { BRAND_LOGO_PATH } from './build-brand-assets.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

async function generateOgImage() {
  const width = 1200;
  const height = 630;

  // Primary GN Monogram Logo (top-left)
  // viewBox: 207 223 2243 1811 (center at 1328.5, 1128.5)
  const logoWidth = 56;
  const scale = logoWidth / 2243;
  const logoX = 76 + logoWidth / 2;
  const logoY = 92;
  const tx = logoX - 1328.5 * scale;
  const ty = logoY - 1128.5 * scale;

  // Tiny GN emblem inside GanOS menu bar
  const miniWidth = 14;
  const miniScale = miniWidth / 2243;
  const miniTx = 666 + miniWidth / 2 - 1328.5 * miniScale;
  const miniTy = 88 - 1128.5 * miniScale;

  // GitHub contribution mini-dots inside the GanOS desktop preview widget
  const contribColors = [
    'rgba(255,255,255,0.08)',
    'rgba(34,197,94,0.28)',
    'rgba(34,197,94,0.52)',
    'rgba(34,197,94,0.78)',
    '#4ade80',
  ];
  const contribPattern = [
    [1, 2, 0, 3, 2, 4, 1, 2, 3, 1],
    [2, 3, 4, 2, 1, 3, 4, 2, 0, 2],
    [0, 1, 2, 4, 3, 2, 1, 3, 4, 3],
    [1, 3, 2, 1, 4, 3, 2, 4, 2, 1],
  ];
  const contribRects = contribPattern
    .flatMap((row, r) =>
      row.map(
        (level, c) =>
          `<rect x="${1008 + c * 9.5}" y="${152 + r * 9.5}" width="6.5" height="6.5" rx="1.8" fill="${contribColors[level]}" />`
      )
    )
    .join('\n      ');

  // Tech stack chips
  const chips = [
    { label: 'TypeScript', width: 102 },
    { label: 'React', width: 68 },
    { label: 'Next.js', width: 78 },
    { label: 'Flutter', width: 78 },
    { label: 'Cloudflare', width: 100 },
  ];
  let chipX = 76;
  const chipSvg = chips
    .map((chip) => {
      const x = chipX;
      chipX += chip.width + 10;
      return `<g transform="translate(${x}, 382)">
      <rect width="${chip.width}" height="32" rx="8" fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.11)" stroke-width="1" />
      <text x="${chip.width / 2}" y="20.5" text-anchor="middle" class="font-mono" font-size="12" font-weight="500" fill="#d8d1c7">${chip.label}</text>
    </g>`;
    })
    .join('\n    ');

  // Dock icons inside miniature GanOS desktop
  const dockApps = [
    { bg1: '#38bdf8', bg2: '#0284c7', symbol: 'finder' },
    { bg1: '#f59e0b', bg2: '#d97736', symbol: 'projects' },
    { bg1: '#60a5fa', bg2: '#2563eb', symbol: 'safari' },
    { bg1: '#fbbf24', bg2: '#d97706', symbol: 'notes' },
    { bg1: '#27272a', bg2: '#09090b', symbol: 'terminal' },
    { bg1: '#fb7185', bg2: '#e11d48', symbol: 'resume' },
  ];
  const dockIconsSvg = dockApps
    .map((app, i) => {
      const x = 785 + i * 36;
      const y = 450;
      const inner =
        app.symbol === 'terminal'
          ? `<text x="${x + 14}" y="${y + 18.5}" text-anchor="middle" class="font-mono" font-size="11" font-weight="700" fill="#4ade80">&gt;_</text>`
          : app.symbol === 'projects'
            ? `<rect x="${x + 7}" y="${y + 9}" width="14" height="10" rx="2" fill="rgba(255,255,255,0.9)" />`
            : `<circle cx="${x + 14}" cy="${y + 14}" r="6" fill="rgba(255,255,255,0.88)" />`;
      return `<g>
        <rect x="${x}" y="${y}" width="28" height="28" rx="7" fill="url(#dockApp${i})" stroke="rgba(255,255,255,0.22)" stroke-width="0.75" />
        ${inner}
      </g>`;
    })
    .join('\n      ');

  const dockGrads = dockApps
    .map(
      (app, i) => `<linearGradient id="dockApp${i}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${app.bg1}" />
      <stop offset="100%" stop-color="${app.bg2}" />
    </linearGradient>`
    )
    .join('\n    ');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <!-- Deep Obsidian Canvas -->
    <radialGradient id="bgCanvas" cx="24%" cy="32%" r="90%">
      <stop offset="0%" stop-color="#141110" />
      <stop offset="45%" stop-color="#09090c" />
      <stop offset="100%" stop-color="#050507" />
    </radialGradient>

    <!-- Warm Terracotta Brand Glow (Left) -->
    <radialGradient id="ambientWarm" cx="16%" cy="22%" r="44%">
      <stop offset="0%" stop-color="#d97736" stop-opacity="0.2" />
      <stop offset="45%" stop-color="#d97736" stop-opacity="0.06" />
      <stop offset="100%" stop-color="#070709" stop-opacity="0" />
    </radialGradient>

    <!-- Cool GanOS Atmosphere Glow (Right, behind Desktop Frame) -->
    <radialGradient id="ambientOs" cx="76%" cy="46%" r="42%">
      <stop offset="0%" stop-color="#1d5ddb" stop-opacity="0.26" />
      <stop offset="50%" stop-color="#46b4d5" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#070709" stop-opacity="0" />
    </radialGradient>

    <!-- Sculpted Metallic GN Brand Gradient -->
    <linearGradient id="gnBrandGrad" x1="15%" y1="5%" x2="85%" y2="95%">
      <stop offset="0%" stop-color="#f4b782" />
      <stop offset="50%" stop-color="#d97736" />
      <stop offset="100%" stop-color="#a8501c" />
    </linearGradient>

    <!-- Ceramic White Headline Gradient -->
    <linearGradient id="nameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#eae4db" />
    </linearGradient>

    <!-- GanOS Miniature Wallpaper Gradients -->
    <linearGradient id="osWallBase" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#030942" />
      <stop offset="52%" stop-color="#0a1b6e" />
      <stop offset="100%" stop-color="#04082b" />
    </linearGradient>
    <radialGradient id="osWallAqua" cx="84%" cy="22%" r="58%">
      <stop offset="0%" stop-color="#63ede8" stop-opacity="0.52" />
      <stop offset="48%" stop-color="#46b4d5" stop-opacity="0.22" />
      <stop offset="100%" stop-color="#1d5ddb" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="osWallCobalt" cx="24%" cy="76%" r="62%">
      <stop offset="0%" stop-color="#1d5ddb" stop-opacity="0.58" />
      <stop offset="60%" stop-color="#5e41ea" stop-opacity="0.22" />
      <stop offset="100%" stop-color="#030942" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="osTerrain" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0b1f70" stop-opacity="0.65" />
      <stop offset="100%" stop-color="#030624" stop-opacity="0.96" />
    </linearGradient>

    <!-- Desktop Frame Border -->
    <linearGradient id="frameBezel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#63ede8" stop-opacity="0.45" />
      <stop offset="45%" stop-color="#ffffff" stop-opacity="0.18" />
      <stop offset="100%" stop-color="#d97736" stop-opacity="0.35" />
    </linearGradient>

    <!-- Flush Perimeter Card Bezel -->
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d97736" stop-opacity="0.48" />
      <stop offset="35%" stop-color="#ffffff" stop-opacity="0.1" />
      <stop offset="70%" stop-color="#46b4d5" stop-opacity="0.16" />
      <stop offset="100%" stop-color="#d97736" stop-opacity="0.28" />
    </linearGradient>

    ${dockGrads}

    <!-- Soft Glow Filter for Brand Logo -->
    <filter id="logoGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="7" result="blur" />
      <feColorMatrix type="matrix" values="0 0 0 0 0.85  0 0 0 0 0.47  0 0 0 0 0.21  0 0 0 0.5 0" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <!-- Soft Window Shadow -->
    <filter id="winShadow" x="-12%" y="-12%" width="124%" height="128%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="10" result="blur" />
      <feOffset dy="8" result="offsetBlur" />
      <feFlood flood-color="#000000" flood-opacity="0.52" />
      <feComposite in2="offsetBlur" operator="in" result="shadow" />
      <feMerge>
        <feMergeNode in="shadow" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- ClipPath for GanOS Desktop Screen -->
    <clipPath id="osScreenClip">
      <rect x="648" y="76" width="476" height="416" rx="16" />
    </clipPath>
  </defs>

  <style>
    .font-sans {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Plus Jakarta Sans", "Inter", sans-serif;
    }
    .font-mono {
      font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
    }
  </style>

  <!-- 1. Background & Motivated Dual-Tone Atmosphere -->
  <rect width="${width}" height="${height}" fill="url(#bgCanvas)" />
  <rect width="${width}" height="${height}" fill="url(#ambientWarm)" />
  <rect width="${width}" height="${height}" fill="url(#ambientOs)" />

  <!-- 2. Top-Left Brand Lockup -->
  <g transform="translate(${tx}, ${ty}) scale(${scale})" filter="url(#logoGlow)">
    <path fill="url(#gnBrandGrad)" fill-rule="evenodd" d="${BRAND_LOGO_PATH}" />
  </g>
  <line x1="150" y1="80" x2="150" y2="104" stroke="rgba(255,255,255,0.16)" stroke-width="1" />
  <g transform="translate(168, 96)">
    <text x="0" y="0" class="font-mono" font-size="12" font-weight="600" letter-spacing="0.18em" fill="#f0a870">GANOS</text>
    <text x="58" y="0" class="font-mono" font-size="12" font-weight="400" letter-spacing="0.12em" fill="#8b857c">· INTERACTIVE PORTFOLIO</text>
  </g>

  <!-- 3. Primary Editorial Copy (Left Column) -->
  <text x="76" y="232" class="font-sans" font-size="52" font-weight="700" letter-spacing="-0.03em" fill="url(#nameGrad)">Ghufron Ainun Najib</text>
  <text x="76" y="284" class="font-sans" font-size="24" font-weight="500" fill="#e2dcd2" letter-spacing="-0.01em">Full-Stack &amp; Mobile Developer</text>
  <text x="76" y="324" class="font-sans" font-size="16" font-weight="400" fill="#9a948b">Explore projects, case studies, writing &amp; resume</text>
  <text x="76" y="348" class="font-sans" font-size="16" font-weight="400" fill="#9a948b">inside a macOS-inspired desktop web experience.</text>

  <!-- 4. Tech Stack Pills -->
  ${chipSvg}

  <!-- 5. Status Pill -->
  <g transform="translate(76, 462)">
    <circle cx="5" cy="-4" r="3.8" fill="#22c55e" />
    <text x="18" y="0" class="font-mono" font-size="11.5" font-weight="500" letter-spacing="0.12em" fill="#9a948b">OPEN TO OPPORTUNITIES · SEMARANG, ID</text>
  </g>

  <!-- 6. Right Column: Miniature GanOS Desktop Showcase -->
  <g filter="url(#winShadow)">
    <!-- Screen Outer Shell -->
    <rect x="648" y="76" width="476" height="416" rx="16" fill="#04082b" />

    <!-- Clipped GanOS Screen Content -->
    <g clip-path="url(#osScreenClip)">
      <!-- GanOS Wallpaper -->
      <rect x="648" y="76" width="476" height="416" fill="url(#osWallBase)" />
      <rect x="648" y="76" width="476" height="416" fill="url(#osWallAqua)" />
      <rect x="648" y="76" width="476" height="416" fill="url(#osWallCobalt)" />
      <path d="M648 364 C728 330 812 334 888 362 C964 390 1044 344 1124 352 V492 H648 Z" fill="url(#osTerrain)" />
      <path d="M648 364 C728 330 812 334 888 362 C964 390 1044 344 1124 352" stroke="#63ede8" stroke-opacity="0.32" stroke-width="1.4" fill="none" />

      <!-- Top Menu Bar -->
      <rect x="648" y="76" width="476" height="24" fill="rgba(7, 9, 16, 0.74)" />
      <line x1="648" y1="100" x2="1124" y2="100" stroke="rgba(255,255,255,0.08)" stroke-width="0.75" />
      <g transform="translate(${miniTx}, ${miniTy}) scale(${miniScale})">
        <path fill="#f08a46" fill-rule="evenodd" d="${BRAND_LOGO_PATH}" />
      </g>
      <text x="688" y="91.5" class="font-sans" font-size="9.5" font-weight="700" fill="#ffffff">GanOS</text>
      <text x="730" y="91.5" class="font-sans" font-size="9" font-weight="400" fill="rgba(255,255,255,0.62)">Finder</text>
      <text x="767" y="91.5" class="font-sans" font-size="9" font-weight="400" fill="rgba(255,255,255,0.62)">Projects</text>
      <text x="811" y="91.5" class="font-sans" font-size="9" font-weight="400" fill="rgba(255,255,255,0.62)">About</text>

      <!-- Dynamic Island Notch -->
      <rect x="852" y="80" width="68" height="16" rx="8" fill="#050507" stroke="rgba(255,255,255,0.12)" stroke-width="0.75" />
      <circle cx="864" cy="88" r="2.6" fill="#d97736" />
      <rect x="872" y="86.5" width="24" height="3" rx="1.5" fill="rgba(255,255,255,0.38)" />
      <circle cx="908" cy="88" r="2.2" fill="#22c55e" />

      <text x="1110" y="91.5" text-anchor="end" class="font-mono" font-size="9" font-weight="500" fill="rgba(255,255,255,0.78)">09:41</text>

      <!-- Sonoma GitHub Contributions Widget (Top-Right, Cleanly Unoccluded) -->
      <rect x="996" y="118" width="114" height="88" rx="13" fill="rgba(16, 19, 28, 0.82)" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
      <circle cx="1010" cy="133" r="3" fill="#4ade80" />
      <text x="1019" y="136" class="font-mono" font-size="8.5" font-weight="600" fill="rgba(255,255,255,0.9)">GITHUB</text>
      <text x="1098" y="136" text-anchor="end" class="font-mono" font-size="7.5" fill="#4ade80">LIVE</text>
      ${contribRects}

      <!-- Sonoma Shipped Widget (Mid-Right, Cleanly Unoccluded) -->
      <rect x="996" y="216" width="114" height="72" rx="13" fill="rgba(16, 19, 28, 0.82)" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
      <text x="1008" y="236" class="font-mono" font-size="8" font-weight="600" letter-spacing="0.08em" fill="rgba(255,255,255,0.52)">SHIPPED</text>
      <text x="1008" y="268" class="font-sans" font-size="24" font-weight="700" fill="#ffffff">10+</text>
      <text x="1054" y="268" class="font-sans" font-size="9.5" fill="rgba(255,255,255,0.68)">products</text>

      <!-- Sonoma Location / Clock Mini Widget (Lower-Right) -->
      <rect x="996" y="298" width="114" height="72" rx="13" fill="rgba(16, 19, 28, 0.82)" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
      <text x="1008" y="318" class="font-mono" font-size="8" font-weight="600" letter-spacing="0.08em" fill="rgba(255,255,255,0.52)">SEMARANG</text>
      <text x="1008" y="346" class="font-sans" font-size="18" font-weight="700" fill="#ffffff">WIB</text>
      <text x="1050" y="346" class="font-mono" font-size="9" fill="#63ede8">UTC+7</text>

      <!-- Main Floating GanOS App Window (Finder / Projects) -->
      <g filter="url(#winShadow)">
        <rect x="664" y="118" width="320" height="304" rx="12" fill="#13161e" fill-opacity="0.96" stroke="rgba(255,255,255,0.16)" stroke-width="1" />
        <!-- Window Titlebar -->
        <rect x="664" y="118" width="320" height="30" rx="12" fill="#1b1f2a" />
        <rect x="664" y="136" width="320" height="12" fill="#1b1f2a" />
        <line x1="664" y1="148" x2="984" y2="148" stroke="rgba(255,255,255,0.08)" stroke-width="1" />

        <!-- Traffic Lights -->
        <circle cx="680" cy="133" r="4.5" fill="#ff5f57" />
        <circle cx="694" cy="133" r="4.5" fill="#febc2e" />
        <circle cx="708" cy="133" r="4.5" fill="#28c840" />
        <text x="824" y="136.5" text-anchor="middle" class="font-sans" font-size="10.5" font-weight="600" fill="rgba(255,255,255,0.84)">Projects — GanOS</text>

        <!-- Sidebar -->
        <rect x="665" y="148" width="80" height="273" fill="rgba(255,255,255,0.025)" />
        <line x1="745" y1="148" x2="745" y2="421" stroke="rgba(255,255,255,0.07)" stroke-width="1" />
        <rect x="672" y="160" width="66" height="22" rx="6" fill="rgba(217, 119, 54, 0.22)" />
        <text x="681" y="174.5" class="font-sans" font-size="9.5" font-weight="600" fill="#f4b782">Featured</text>
        <text x="681" y="199" class="font-sans" font-size="9.5" fill="rgba(255,255,255,0.52)">About Me</text>
        <text x="681" y="221" class="font-sans" font-size="9.5" fill="rgba(255,255,255,0.52)">Writing</text>
        <text x="681" y="243" class="font-sans" font-size="9.5" fill="rgba(255,255,255,0.52)">Resume</text>
        <text x="681" y="265" class="font-sans" font-size="9.5" fill="rgba(255,255,255,0.52)">Terminal</text>

        <!-- Project Cards Grid inside Window -->
        <!-- Card 1: PB UNDIP -->
        <rect x="758" y="162" width="102" height="114" rx="9" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" stroke-width="0.9" />
        <rect x="766" y="170" width="86" height="44" rx="5" fill="#064e3b" fill-opacity="0.7" />
        <circle cx="777" cy="182" r="3" fill="#34d399" />
        <rect x="784" y="180" width="44" height="4" rx="2" fill="rgba(255,255,255,0.55)" />
        <rect x="774" y="194" width="64" height="4" rx="2" fill="rgba(52,211,153,0.45)" />
        <text x="766" y="232" class="font-sans" font-size="10.5" font-weight="600" fill="#f3f4f6">PB UNDIP</text>
        <text x="766" y="247" class="font-mono" font-size="8" fill="#9ca3af">Next.js · Convex</text>
        <rect x="766" y="257" width="38" height="11" rx="4" fill="rgba(5,150,105,0.22)" />
        <text x="785" y="265" text-anchor="middle" class="font-mono" font-size="7.5" fill="#34d399">2026</text>

        <!-- Card 2: TempeMail -->
        <rect x="870" y="162" width="102" height="114" rx="9" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" stroke-width="0.9" />
        <rect x="878" y="170" width="86" height="44" rx="5" fill="#7c2d12" fill-opacity="0.68" />
        <circle cx="889" cy="182" r="3" fill="#fb923c" />
        <rect x="896" y="180" width="46" height="4" rx="2" fill="rgba(255,255,255,0.55)" />
        <rect x="886" y="194" width="56" height="4" rx="2" fill="rgba(251,146,60,0.5)" />
        <text x="878" y="232" class="font-sans" font-size="10.5" font-weight="600" fill="#f3f4f6">TempeMail</text>
        <text x="878" y="247" class="font-mono" font-size="8" fill="#9ca3af">Workers · Hono</text>
        <rect x="878" y="257" width="38" height="11" rx="4" fill="rgba(217,119,54,0.24)" />
        <text x="897" y="265" text-anchor="middle" class="font-mono" font-size="7.5" fill="#fb923c">2026</text>

        <!-- Card 3: Curated Design -->
        <rect x="758" y="288" width="102" height="114" rx="9" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" stroke-width="0.9" />
        <rect x="766" y="296" width="86" height="44" rx="5" fill="#312e81" fill-opacity="0.65" />
        <circle cx="777" cy="308" r="3" fill="#818cf8" />
        <rect x="784" y="306" width="48" height="4" rx="2" fill="rgba(255,255,255,0.55)" />
        <rect x="774" y="320" width="58" height="4" rx="2" fill="rgba(129,140,248,0.5)" />
        <text x="766" y="358" class="font-sans" font-size="10" font-weight="600" fill="#f3f4f6">Curated Design</text>
        <text x="766" y="373" class="font-mono" font-size="8" fill="#9ca3af">React · Vite</text>
        <rect x="766" y="383" width="46" height="11" rx="4" fill="rgba(99,102,241,0.22)" />
        <text x="789" y="391" text-anchor="middle" class="font-mono" font-size="7.5" fill="#a5b4fc">292+ UI</text>

        <!-- Card 4: SewaInAja -->
        <rect x="870" y="288" width="102" height="114" rx="9" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" stroke-width="0.9" />
        <rect x="878" y="296" width="86" height="44" rx="5" fill="#134e4a" fill-opacity="0.72" />
        <circle cx="889" cy="308" r="3" fill="#2dd4bf" />
        <rect x="896" y="306" width="42" height="4" rx="2" fill="rgba(255,255,255,0.55)" />
        <rect x="886" y="320" width="50" height="4" rx="2" fill="rgba(45,212,191,0.48)" />
        <text x="878" y="358" class="font-sans" font-size="10.5" font-weight="600" fill="#f3f4f6">SewaInAja</text>
        <text x="878" y="373" class="font-mono" font-size="8" fill="#9ca3af">Flutter · Next.js</text>
        <rect x="878" y="383" width="42" height="11" rx="4" fill="rgba(20,184,166,0.22)" />
        <text x="899" y="391" text-anchor="middle" class="font-mono" font-size="7.5" fill="#5eead4">Mobile</text>
      </g>

      <!-- Bottom Floating macOS Dock -->
      <rect x="771" y="443" width="236" height="44" rx="13" fill="rgba(18, 22, 34, 0.74)" stroke="rgba(255,255,255,0.22)" stroke-width="1" />
      ${dockIconsSvg}
      <!-- Active indicator dot under Projects icon -->
      <circle cx="835" cy="482.5" r="1.8" fill="#ffffff" />
    </g>

    <!-- Desktop Screen Frame Bezel -->
    <rect x="648" y="76" width="476" height="416" rx="16" fill="none" stroke="url(#frameBezel)" stroke-width="1.25" />
  </g>

  <!-- 7. Structural Hairline Separator & Signature Footer -->
  <line x1="76" y1="534" x2="1124" y2="534" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />

  <g transform="translate(76, 576)">
    <circle cx="0" cy="-4.5" r="3.5" fill="#d97736" />
    <text x="14" y="0" class="font-mono" font-size="14" font-weight="600" letter-spacing="0.04em" fill="#f0a870">ghufronainun.tech</text>
  </g>

  <g transform="translate(1124, 576)" text-anchor="end">
    <text x="0" y="0" class="font-mono" font-size="12.5" font-weight="400" letter-spacing="0.08em" fill="#827c73">Projects · Case Studies · Writing · Resume</text>
  </g>

  <!-- 8. Flush 1px Perimeter Bezel -->
  <rect x="0.5" y="0.5" width="1199" height="629" fill="none" stroke="url(#borderGrad)" stroke-width="1" />
</svg>`;

  const outPath = resolve(root, 'public/og-image.png');
  const buffer = Buffer.from(svg);

  await sharp(buffer)
    .resize(width, height)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(outPath);

  console.log('✓ Generated GanOS Interactive Desktop OG Image -> public/og-image.png');
}

generateOgImage().catch(console.error);
