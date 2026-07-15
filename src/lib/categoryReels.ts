import {
  weddingReel,
  engagementReel,
  carterForeverAfter,
  kfcSalemOpening,
  krispyKremeFinal,
  sevenKraveAd,
  xodusWetCampari2026,
  nightCarnivalRedPassion,
  redbullIls,
  redbullUwiBandLaunch,
  aeJamaicaCarnival,
  campariXodusMixActivation,
  appletonEstateBartender,
  sol4kPromo,
  kcbw26MaxLife,
} from "@/lib/videos";

export type Reel = { src: string; label: string };

export const CATEGORY_REELS: Record<string, Reel[]> = {
  weddings: [
    { src: weddingReel, label: "Wedding Film · 4K" },
    { src: engagementReel, label: "Engagement Film · 4K" },
    { src: carterForeverAfter, label: "Carter · Forever After 4K" },
  ],
  ads: [
    { src: sevenKraveAd, label: "7Krave · Brand Commercial" },
    { src: kfcSalemOpening, label: "KFC Salem · Soft Opening Day 4K" },
    { src: krispyKremeFinal, label: "Krispy Kreme · Brand Ad" },
  ],
  entertainment: [
    { src: xodusWetCampari2026, label: "XODUS WET × Campari 2026" },
    { src: nightCarnivalRedPassion, label: "Night Carnival · Red Passion 4K" },
    { src: redbullIls, label: "Red Bull × ILS" },
    { src: redbullUwiBandLaunch, label: "Red Bull × UWI Band Launch" },
    { src: aeJamaicaCarnival, label: "AE × Jamaica Carnival 2026 4K" },
  ],
  corporate: [
    { src: campariXodusMixActivation, label: "Campari Xodus Mix Activation · Event Film" },
    { src: appletonEstateBartender, label: "Appleton Estate Bartender Competition 4K" },
  ],
  lifestyle: [
    { src: sol4kPromo, label: "Sol · 4K Promo" },
    { src: kcbw26MaxLife, label: "KCBW 26 · Max Life" },
  ],
};
