import prisma from "@/lib/db";

export async function collectedRevenueDollars(): Promise<number> {
  const row = await prisma.bid.aggregate({
    _sum: { amount: true },
    where: {
      status: "succeeded",
      NOT: { paymentId: { startsWith: "backdoor:" } },
    },
  });
  return row._sum.amount ?? 0;
}

export async function liveVisitorCount(): Promise<number> {
  return prisma.visitor.count({
    where: { lastSeenAt: { gte: new Date(Date.now() - 60_000) } },
  });
}
