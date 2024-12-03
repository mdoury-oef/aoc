import { load } from "lib/load";

const reports = await load({ parse: Number });

function isSafe(levels: number[]) {
  const changes = levels.reduce<number[]>((changes, level, index) => {
    if (index !== 0) {
      changes.push(levels[index - 1] - level);
    }
    return changes;
  }, []);

  return (
    (changes.every((change) => change > 0) ||
      changes.every((change) => change < 0)) &&
    changes.map(Math.abs).every((change) => change >= 1 && change <= 3)
  );
}

let safeReports = 0;
for (const report of reports) {
  if (isSafe(report)) {
    safeReports++;
  }
}

console.log(`Safe reports: ${safeReports}`);
