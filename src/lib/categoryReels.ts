import weddingReel from "@/assets/wedding-reel.mp4.asset.json";
import engagementReel from "@/assets/engagement-reel.mp4.asset.json";
import kfcSalemOpening from "@/assets/kfc-salem-opening.mp4.asset.json";
import krispyKremeFinal from "@/assets/krispy-kreme-final.mp4.asset.json";
import campariXodusMixActivation from "@/assets/campari-xodus-mix-activation-updated.mp4.asset.json";
import kcbw26MaxLife from "@/assets/kcbw-26-max-life.mp4.asset.json";
import kcbw26MaxLife2 from "@/assets/kcbw-26-max-life-2.mp4.asset.json";
import sol4kPromo from "@/assets/sol-4k-promo.mp4.asset.json";
import carterForeverAfter from "@/assets/carter-forever-after.mp4.asset.json";

export type Reel = { src: string; label: string };

export const CATEGORY_REELS: Record<string, Reel[]> = {
  weddings: [
    { src: weddingReel.url, label: "Wedding Film — 4K" },
    { src: engagementReel.url, label: "Engagement Film — 4K" },
    { src: carterForeverAfter.url, label: "Carter — Forever After 4K" },
  ],
  ads: [
    {
      src: "https://dl.dropboxusercontent.com/scl/fi/bd9dwxcggiv5pkuisw7l6/7krave-Ad-with-Engaging-end-music-HQ.mp4?rlkey=r1yc1nkg2yjypj42g69kup7cd&st=qrpmi8rb",
      label: "7Krave Ad — Brand Commercial",
    },
    { src: kfcSalemOpening.url, label: "KFC Salem — Soft Opening Day 4K" },
    { src: krispyKremeFinal.url, label: "Krispy Kreme — Brand Ad" },
  ],
  entertainment: [
    {
      src: "https://dl.dropboxusercontent.com/scl/fi/liyofu1tqro1gg3qypesk/XODUS-WET-x-CAMPARI-2026-Final.mp4?rlkey=ykq9w721o7idxkj2rrx1ldjeu&st=tlfw46j1",
      label: "XODUS WET x CAMPARI — 2026",
    },
    {
      src: "https://dl.dropboxusercontent.com/scl/fi/6rxrt2j8lqnhiy28gaaou/Night-Carnival-Recap-Red-Passion-4k.mp4?rlkey=hhb1gdu1rdrl70a6qnalbxo6g&st=c3c2te0e",
      label: "Night Carnival — Red Passion 4K",
    },
    {
      src: "https://dl.dropboxusercontent.com/scl/fi/sh3hyo99nc5dppoayjhny/REDBULL-x-ILS-Final.mp4?rlkey=ixb7wd86y9gozxxfy6h4752n1&st=enmjlc0q",
      label: "REDBULL x ILS — 2025",
    },
    {
      src: "https://dl.dropboxusercontent.com/scl/fi/thd8iw8gzb1867q167ynt/REDBULL-x-UWI-Band-Launch.mp4?rlkey=9bfos1cebdkaew25xeoi2pawd&st=jufpcv7a",
      label: "REDBULL x UWI Band Launch — 2025",
    },
    {
      src: "https://dl.dropboxusercontent.com/scl/fi/ednx1y0hyi7cvmk7ry3ti/AE-x-Jamaica-Carnival-2026-4k.mp4?rlkey=fm4c0liyyk075d9qv9wcwcwlq&st=ztigm5l6",
      label: "AE x Jamaica Carnival — 2026 4K",
    },
  ],
  corporate: [
    { src: campariXodusMixActivation.url, label: "Campari Xodus Mix Activation — Event Film" },
    {
      src: "https://dl.dropboxusercontent.com/scl/fi/bnl7gdnslf7gelc1ou15i/Appleton-Estate-Bartender-Competition-4K.mp4?rlkey=4424b1lfrhagmxuccd4nyi4ad&st=0c1uet7b",
      label: "Appleton Estate Bartender — Competition Recap 4K",
    },
  ],
  lifestyle: [
    { src: sol4kPromo.url, label: "Sol — 4K Promo" },
    { src: kcbw26MaxLife.url, label: "KCBW 26 — Max Life" },
    { src: kcbw26MaxLife2.url, label: "KCBW 26 — Max Life Vol. 2" },
  ],
};
