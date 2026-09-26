import type { Landmark } from '../types';

export function getLandmarkSvg(landmark: Landmark, color: string): string {
  switch (landmark.iconType) {
    case 'statue':
      // Inverted Statue of Liberty silhouette (torch pointing down, pedestal up)
      return `
        <svg viewBox="0 0 120 200" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="landmark-svg">
          <!-- Inverted: Pedestal at top, Crown and Torch at bottom -->
          <!-- Pedestal foundation (top) -->
          <rect x="25" y="10" width="70" height="12" rx="1" />
          <rect x="35" y="22" width="50" height="24" />
          <line x1="30" y1="46" x2="90" y2="46" />
          <!-- Torso and Robes descending -->
          <path d="M42 46 L38 120 L82 120 L78 46" />
          <path d="M48 60 Q50 90 46 118" stroke-dasharray="2 3" />
          <path d="M72 60 Q70 90 74 118" stroke-dasharray="2 3" />
          <!-- Crown and Head -->
          <circle cx="60" cy="130" r="10" />
          <!-- Radiating spikes of Crown pointing downwards -->
          <line x1="52" y1="138" x2="44" y2="148" />
          <line x1="56" y1="140" x2="52" y2="152" />
          <line x1="60" y1="140" x2="60" y2="154" />
          <line x1="64" y1="140" x2="68" y2="152" />
          <line x1="68" y1="138" x2="76" y2="148" />
          <!-- Extended Arm pointing downward holding the flaming torch -->
          <path d="M76 80 L88 140 L86 170" />
          <!-- Torch Flame at lowest point -->
          <path d="M86 170 Q92 178 86 190 Q80 178 86 170 Z" fill="${color}" fill-opacity="0.25" />
          <!-- Tablet held against body -->
          <rect x="36" y="85" width="16" height="24" transform="rotate(-15 36 85)" />
        </svg>
      `;

    case 'skyscraper':
      // Inverted Burj Khalifa (Massive stepped spire suspended like a crystal stalactite)
      return `
        <svg viewBox="0 0 100 240" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="landmark-svg">
          <!-- Wide foundation base at top -->
          <line x1="15" y1="10" x2="85" y2="10" />
          <rect x="25" y="10" width="50" height="25" />
          <!-- Tiered stepped setbacks tapering downward -->
          <path d="M30 35 L30 70 L35 70 L35 110 L40 110 L40 150 L45 150 L45 190 L50 230 L55 190 L55 150 L60 150 L60 110 L65 110 L65 70 L70 70 L70 35" />
          <!-- Central structural core lines -->
          <line x1="50" y1="10" x2="50" y2="230" stroke-dasharray="4 4" />
          <line x1="42" y1="35" x2="42" y2="150" stroke-opacity="0.5" />
          <line x1="58" y1="35" x2="58" y2="150" stroke-opacity="0.5" />
          <!-- Needle tip pointing toward bottomless abyss -->
          <circle cx="50" cy="232" r="2.5" fill="${color}" />
        </svg>
      `;

    case 'ship':
      // RMS Titanic (Resting gracefully in two split sections on the quiet seabed)
      return `
        <svg viewBox="0 0 180 100" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="landmark-svg">
          <!-- Ocean bed horizon -->
          <path d="M10 85 Q90 88 170 85" stroke-dasharray="3 3" stroke-opacity="0.5" />
          <!-- Bow section resting upright in sediment -->
          <path d="M20 78 L45 50 L100 50 L105 82 Z" />
          <!-- Distinctive raked prow -->
          <path d="M20 78 L26 48 L45 50" />
          <!-- Anchor hawsehole and bridge superstructure -->
          <circle cx="34" cy="56" r="2" fill="${color}" />
          <rect x="55" y="38" width="30" height="12" />
          <!-- Fallen forward mast -->
          <line x1="48" y1="50" x2="30" y2="35" stroke-dasharray="2 2" />
          <!-- Ghostly steam funnels raked back -->
          <line x1="62" y1="38" x2="66" y2="22" />
          <line x1="75" y1="38" x2="79" y2="22" />
          <!-- Stern section 600m away in the gloom -->
          <path d="M125 82 L130 60 L160 62 L155 83 Z" stroke-opacity="0.6" />
        </svg>
      `;

    case 'mountain':
      // Mount Everest (Inverted Himalayan massif descending downward)
      return `
        <svg viewBox="0 0 160 180" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="landmark-svg">
          <!-- Mountain base line at top -->
          <line x1="10" y1="15" x2="150" y2="15" stroke-opacity="0.4" />
          <!-- Inverted pyramid ridges meeting at summit pointing downwards -->
          <path d="M20 15 L80 165 L140 15" />
          <!-- Central arête / Hillary Step ridge -->
          <path d="M80 165 L82 90 L60 40 L50 15" />
          <!-- Secondary south col ridge -->
          <path d="M80 165 L105 100 L115 50 L125 15" stroke-dasharray="3 3" />
          <!-- Triangular snow facet accents -->
          <path d="M80 165 L70 120 L80 110 Z" fill="${color}" fill-opacity="0.15" />
          <!-- Summit flag / beacon of stillness -->
          <circle cx="80" cy="167" r="3" fill="${color}" />
        </svg>
      `;

    case 'trench':
      // Challenger Deep / Mariana Trench (V-shaped tectonic abyss bathymetry)
      return `
        <svg viewBox="0 0 160 180" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="landmark-svg">
          <!-- Tectonic plate fault lines sloping sharply inward -->
          <path d="M10 20 Q45 70 70 145 L80 165 L90 145 Q115 70 150 20" />
          <!-- Subducting plate steps -->
          <line x1="25" y1="50" x2="45" y2="50" stroke-opacity="0.5" />
          <line x1="40" y1="90" x2="60" y2="90" stroke-opacity="0.5" />
          <line x1="135" y1="50" x2="115" y2="50" stroke-opacity="0.5" />
          <line x1="120" y1="90" x2="100" y2="90" stroke-opacity="0.5" />
          <!-- Sounding echo wave / bathymetric probe pulse -->
          <circle cx="80" cy="165" r="8" stroke-dasharray="2 3" />
          <circle cx="80" cy="165" r="18" stroke-dasharray="2 4" stroke-opacity="0.4" />
          <circle cx="80" cy="165" r="2.5" fill="${color}" />
        </svg>
      `;

    case 'tower':
      // Inverted Eiffel Tower
      return `
        <svg viewBox="0 0 120 180" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="landmark-svg">
          <!-- Base pillars at top -->
          <path d="M25 10 L40 60 L80 60 L95 10" />
          <path d="M40 60 L50 110 L70 110 L80 60" />
          <path d="M50 110 L60 165 L70 110" />
          <!-- Architectural lattice crossbracing -->
          <line x1="42" y1="35" x2="78" y2="35" />
          <line x1="45" y1="85" x2="75" y2="85" />
          <line x1="40" y1="10" x2="80" y2="60" stroke-opacity="0.4" />
          <line x1="80" y1="10" x2="40" y2="60" stroke-opacity="0.4" />
          <circle cx="60" cy="168" r="2" fill="${color}" />
        </svg>
      `;

    case 'diver':
      // Free diver gliding downward into the deep
      return `
        <svg viewBox="0 0 80 140" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="landmark-svg">
          <!-- Monofin at top -->
          <path d="M25 15 C35 25 45 25 55 15 C52 28 48 32 40 38 C32 32 28 28 25 15 Z" fill="${color}" fill-opacity="0.2" />
          <!-- Slender body in streamlined streamline plunge -->
          <line x1="40" y1="38" x2="40" y2="70" />
          <path d="M40 70 L38 100 L42 100 Z" />
          <!-- Head pointing downward -->
          <circle cx="40" cy="115" r="7" />
          <!-- Reaching arms framing head -->
          <path d="M35 75 L30 115 L38 128" />
          <path d="M45 75 L50 115 L42 128" />
          <!-- Gentle stream of microscopic bubbles -->
          <circle cx="40" cy="85" r="1.5" fill="${color}" fill-opacity="0.6" />
          <circle cx="43" cy="55" r="1" fill="${color}" fill-opacity="0.4" />
        </svg>
      `;

    case 'whale':
      // Blue whale diving vertically into abyssal depths
      return `
        <svg viewBox="0 0 100 160" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="landmark-svg">
          <!-- Tail flukes at top -->
          <path d="M30 15 Q50 30 50 45 Q50 30 70 15 Q55 22 50 32 Q45 22 30 15 Z" fill="${color}" fill-opacity="0.2" />
          <!-- Massive streamlined torso tapering down -->
          <path d="M50 45 C35 70 32 105 44 135 C47 142 53 142 56 135 C68 105 65 70 50 45 Z" />
          <!-- Pectoral fins -->
          <path d="M36 85 Q20 95 24 105 Q32 98 38 92" />
          <path d="M64 85 Q80 95 76 105 Q68 98 62 92" />
          <!-- Throat ventral grooves -->
          <line x1="47" y1="105" x2="47" y2="128" stroke-dasharray="2 2" stroke-opacity="0.5" />
          <line x1="53" y1="105" x2="53" y2="128" stroke-dasharray="2 2" stroke-opacity="0.5" />
        </svg>
      `;

    case 'crust':
    case 'mantle':
    case 'core':
      // Geologic subterranean crystal & concentric boundary rings
      return `
        <svg viewBox="0 0 140 140" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="landmark-svg">
          <circle cx="70" cy="70" r="58" stroke-dasharray="4 4" stroke-opacity="0.3" />
          <circle cx="70" cy="70" r="42" stroke-dasharray="3 3" stroke-opacity="0.6" />
          <circle cx="70" cy="70" r="26" stroke-opacity="0.8" />
          <circle cx="70" cy="70" r="8" fill="${color}" fill-opacity="0.3" />
          <!-- Axial magnetic lines -->
          <line x1="70" y1="4" x2="70" y2="136" stroke-dasharray="2 3" stroke-opacity="0.4" />
          <line x1="4" y1="70" x2="136" y2="70" stroke-dasharray="2 3" stroke-opacity="0.4" />
        </svg>
      `;

    case 'infinite':
    default:
      // Sacred geometry infinity symbol & calm radiant halo
      return `
        <svg viewBox="0 0 140 140" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="landmark-svg">
          <!-- Concentric ripples of infinite stillness -->
          <circle cx="70" cy="70" r="60" stroke-opacity="0.15" />
          <circle cx="70" cy="70" r="45" stroke-opacity="0.3" />
          <circle cx="70" cy="70" r="30" stroke-opacity="0.5" />
          <!-- Infinite lemniscate -->
          <path d="M50 70 C35 55 20 60 20 70 C20 80 35 85 50 70 C65 55 80 55 90 70 C105 85 120 80 120 70 C120 60 105 55 90 70 C75 85 60 85 50 70 Z" />
          <circle cx="70" cy="70" r="3" fill="${color}" />
        </svg>
      `;
  }
}
