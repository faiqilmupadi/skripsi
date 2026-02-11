export function buildRange(rangePreset?: string, start?: string, end?: string) {
  const now = new Date();
  if (rangePreset === '24h') return { start: new Date(now.getTime() - 24 * 3600 * 1000), end: now };
  if (rangePreset === '7d') return { start: new Date(now.getTime() - 7 * 24 * 3600 * 1000), end: now };
  if (rangePreset === '1m') return { start: new Date(now.getTime() - 30 * 24 * 3600 * 1000), end: now };
  if (start && end) return { start: new Date(start), end: new Date(end) };
  return { start: new Date(now.getTime() - 7 * 24 * 3600 * 1000), end: now };
}
