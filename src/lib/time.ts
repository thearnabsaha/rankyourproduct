export function relativeTime(iso: string | Date): string {
  const then = typeof iso === "string" ? new Date(iso).getTime() : iso.getTime();
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));
  const years = seconds / 31536000;
  if (years > 1) return `${Math.floor(years)} years ago`;
  const months = seconds / 2592000;
  if (months > 1) return `${Math.floor(months)} months ago`;
  const days = seconds / 86400;
  if (days > 1) return `${Math.floor(days)} days ago`;
  const hours = seconds / 3600;
  if (hours > 1) return `${Math.floor(hours)} hours ago`;
  const mins = seconds / 60;
  if (mins >= 1) return `${Math.floor(mins)} mins ago`;
  return "just now";
}
