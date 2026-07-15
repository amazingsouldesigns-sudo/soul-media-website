/**
 * Portfolio reels - Supabase Storage → `category-reels` bucket.
 * Filenames must match the bucket exactly (case + spaces).
 */

const REELS_BUCKET = "category-reels";
const REELS_FOLDER = (import.meta.env.VITE_SUPABASE_REELS_FOLDER ?? "")
  .replace(/^\/+|\/+$/g, "");

const reelsBase = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${REELS_BUCKET}`;

function supabaseReel(filename: string): string {
  const parts = REELS_FOLDER ? [REELS_FOLDER, filename] : [filename];
  return `${reelsBase}/${parts.map(encodeURIComponent).join("/")}`;
}

// ── In bucket ──────────────────────────────────────────────────────────
export const xodusWetCampari2026 = supabaseReel("Xodus Wet X Campari 2026 Final.mp4");
export const nightCarnivalRedPassion = supabaseReel(
  "Night Carnival Recap Red Passion 4K.mp4",
);
export const redbullIls = supabaseReel("Redbull X Ils Final.mp4");
export const redbullUwiBandLaunch = supabaseReel("Redbull X Uwi Band Launch.mp4");
export const sevenKraveAd = supabaseReel("7Krave Ad With Engaging End Music Hq.mp4");
export const appletonEstateBartender = supabaseReel(
  "Appleton Estate Bartender Competition 4K.mp4",
);
export const aeJamaicaCarnival = supabaseReel("Ae X Jamaica Carnival 2026 4K.mp4");
export const weddingReel = supabaseReel("Wedding-Reel.mp4");
export const kfcSalemOpening = supabaseReel("Kfc Salem Soft Opening Day 4K.mp4");
export const krispyKremeFinal = supabaseReel("Krispy-Kreme-Final.mp4");
export const campariXodusMixActivation = supabaseReel(
  "Campari-Xodus-Mix-Activation-Updated.mp4",
);
export const sol4kPromo = supabaseReel("Sol-4K-Promo.mp4");
export const kcbw26MaxLife = supabaseReel("Kcbw-26-Max-Life.mp4");

// Hero uses same uploads where no separate hero cut exists yet
export const xodusWetCampariHero = xodusWetCampari2026;
export const nightCarnivalHero = nightCarnivalRedPassion;

export const engagementReel = supabaseReel("Engagement-Reel.mp4");
export const carterForeverAfter = supabaseReel("Carter-Forever-After.mp4");

// ── Not in bucket yet: re-add to CATEGORY_REELS after uploading ────────
export const kcbw26MaxLife2 = supabaseReel("Kcbw-26-Max-Life-2.mp4");

export type HeroVideo = { title: string; subtitle: string; src: string };

export const HERO_VIDEOS: HeroVideo[] = [
  {
    title: "XODUS WET × Campari",
    subtitle: "Hero · Event Film",
    src: xodusWetCampariHero,
  },
  {
    title: "Night Carnival",
    subtitle: "Hero · Event Film",
    src: nightCarnivalHero,
  },
  {
    title: "Red Bull × ILS",
    subtitle: "Hero · Brand Activation",
    src: redbullIls,
  },
  {
    title: "Red Bull × UWI Band Launch",
    subtitle: "Hero · Live Event",
    src: redbullUwiBandLaunch,
  },
  {
    title: "7Krave",
    subtitle: "Hero · Brand Commercial",
    src: sevenKraveAd,
  },
  {
    title: "Appleton Estate",
    subtitle: "Hero · Bartender Competition",
    src: appletonEstateBartender,
  },
  {
    title: "AE × Jamaica Carnival",
    subtitle: "Hero · Carnival 2026",
    src: aeJamaicaCarnival,
  },
];
