import prisma from "@/lib/db";

const boardWhere = { highestBid: { gt: 0 } };

export const listingOrderBy = [
  { pinned: "desc" as const },
  { pinOrder: "asc" as const },
  { highestBid: "desc" as const },
  { createdAt: "asc" as const },
];

export async function globalHighestBid(): Promise<number> {
  const row = await prisma.listing.aggregate({
    _max: { highestBid: true },
    where: { ...boardWhere, pinned: false },
  });
  return row._max.highestBid ?? 0;
}

export async function predictedRank(
  amount: number,
  excludeListingId?: string | null,
): Promise<number> {
  if (amount < 1) return 0;
  const exclude = excludeListingId ? { id: { not: excludeListingId } } : {};
  const pinnedAbove = await prisma.listing.count({
    where: { ...boardWhere, pinned: true, ...exclude },
  });
  const paidAbove = await prisma.listing.count({
    where: {
      ...boardWhere,
      pinned: false,
      highestBid: { gte: amount },
      ...exclude,
    },
  });
  return pinnedAbove + paidAbove + 1;
}

export async function listingCount(): Promise<number> {
  return prisma.listing.count({ where: { highestBid: { gt: 0 } } });
}
