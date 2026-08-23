export type XProfile = {
  handle: string;
  name: string;
  bio: string;
  avatarUrl: string;
};

export async function fetchXProfile(handle: string): Promise<XProfile | null> {
  const h = handle.replace(/^@/, "").trim();
  if (!h) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(`https://api.fxtwitter.com/${encodeURIComponent(h)}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      user?: {
        screen_name?: string;
        name?: string;
        description?: string;
        avatar_url?: string;
      };
    };
    const user = data.user;
    if (!user?.avatar_url && !user?.name) return null;
    const avatar = (user.avatar_url || "")
      .replace("_normal.", "_400x400.")
      .replace("_mini.", "_400x400.");
    return {
      handle: (user.screen_name || h).replace(/^@/, ""),
      name: user.name || `@${h}`,
      bio: user.description || "",
      avatarUrl: avatar,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
