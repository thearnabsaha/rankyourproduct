import prisma from "@/lib/db";
import { isPublicListingUrl } from "@/lib/url";

/**
 * "Collected $X so far" is every succeeded bid that belongs to a public
 * listing, including owner backdoor rows. Mock payments and localhost
 * listings do not count.
 */
export async function collectedRevenueDollars(): Promise<number> {
  const bids = await prisma.bid.findMany({
    where: {
      status: "succeeded",
      NOT: { paymentId: { startsWith: "mock_" } },
    },
    select: {
      amount: true,
      listing: { select: { canonicalUrl: true } },
    },
  });

  return bids.reduce((sum, bid) => {
    if (!isPublicListingUrl(bid.listing.canonicalUrl)) return sum;
    return sum + bid.amount;
  }, 0);
}
