export function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function localDateOrdinal(dateKey: string): number | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return undefined;
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day
  ) {
    return undefined;
  }
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}

export function getStreaks(
  completedDates: string[],
  today: string,
): { current: number; best: number } {
  const dates = [...new Set(completedDates)]
    .map((date) => ({ date, ordinal: localDateOrdinal(date) }))
    .filter(
      (entry): entry is { date: string; ordinal: number } =>
        entry.ordinal !== undefined,
    )
    .sort((left, right) => left.ordinal - right.ordinal);
  const todayOrdinal = localDateOrdinal(today);
  let best = 0;
  let run = 0;
  let previousOrdinal: number | undefined;

  for (const entry of dates) {
    run =
      previousOrdinal !== undefined && entry.ordinal === previousOrdinal + 1
        ? run + 1
        : 1;
    best = Math.max(best, run);
    previousOrdinal = entry.ordinal;
  }

  const latest = dates.at(-1)?.ordinal;
  const current =
    todayOrdinal !== undefined &&
    latest !== undefined &&
    todayOrdinal - latest >= 0 &&
    todayOrdinal - latest <= 1
      ? run
      : 0;

  return { current, best };
}
