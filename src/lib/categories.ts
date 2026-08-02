export const CATEGORIES = [
  {
    slug: "ads",
    number: "01",
    title: "Ads",
    tagline: "Commercials that move product",
    description: "Cinematic commercials, brand spots, and product launches built to convert.",
  },
  {
    slug: "entertainment",
    number: "02",
    title: "Entertainment",
    tagline: "Music, film & creators",
    description: "Music videos, artist content, short films, and editorial-grade creator work.",
  },
  {
    slug: "corporate",
    number: "03",
    title: "Corporate",
    tagline: "Brand films & internal comms",
    description: "Polished corporate films, executive interviews, conference recaps, and brand storytelling.",
  },
  {
    slug: "weddings",
    number: "04",
    title: "Weddings",
    tagline: "Cinematic love stories",
    description: "Documentary-meets-cinema wedding films and full-day photo coverage.",
  },
  {
    slug: "lifestyle",
    number: "05",
    title: "Lifestyle",
    tagline: "Editorial & social-first",
    description: "Lifestyle shoots, social-native reels, and influencer collaborations.",
  },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export function isValidCategorySlug(slug: string): slug is CategorySlug {
  return CATEGORIES.some((c) => c.slug === slug);
}

export function getProjectHref(slug: string | null): string {
  return slug ? `/services/${slug}#reels` : "/";
}
