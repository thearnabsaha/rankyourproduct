import { listingSlugFromCanonical } from "@/lib/url";

type SlugDb = {
  listing: {
    findUnique: (args: {
      where: { slug: string };
    }) => Promise<{ id: string } | null>;
  };
};

export async function uniqueSlugFor(
  db: SlugDb,
  canonicalUrl: string,
  excludeId?: string,
): Promise<string> {
  const base = listingSlugFromCanonical(canonicalUrl) || "listing";
  let slug = base;
  for (let n = 2; n < 40; n++) {
    const found = await db.listing.findUnique({ where: { slug } });
    if (!found || found.id === excludeId) return slug;
    slug = `${base}-${n}`;
  }
  return `${base}-${Date.now().toString(36)}`;
}
