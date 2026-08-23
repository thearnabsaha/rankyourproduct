/**
 * Owner backdoor. Edit this list, save, refresh the homepage.
 * Listings with pinOrder land at the top in that order (1 = #1),
 * even if someone else pays more.
 *
 * bid is the dollar amount shown on the row.
 * title is the subtitle under the URL.
 */
export type BackdoorListing = {
  url: string;
  title: string;
  bid: number;
  pinOrder: number;
  clicks?: number;
};

export const BACKDOOR_LISTINGS: BackdoorListing[] = [
  {
    url: "https://homeo-gamma.vercel.app/",
    title: "first app",
    bid: 5,
    pinOrder: 1,
    clicks: 190,
  },
  {
    url: "https://x.com/TheArnabSaha",
    title: "Arnab D. Saha",
    bid: 4,
    pinOrder: 2,
    clicks: 156,
  },
];
