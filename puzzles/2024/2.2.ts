import { load } from "lib/load";

const reports = await load({ parse: Number });

function getVariants(levels: number[]) {
  const variants = new Array(levels);
  const indexes = Object.keys(levels).map(Number);
  for (const index of indexes) {
    variants.push([
      ...levels.slice(0, index),
      ...levels.slice(index + 1, levels.length),
    ]);
  }
  return variants;
}

function isSafe(levels: number[]) {
  const changes = levels.reduce((changes, level, index) => {
    if (index !== 0) {
      changes.push(levels[index - 1] - level);
    }
    return changes;
  }, new Array<number>());

  return (
    (changes.every((change) => change > 0) ||
      changes.every((change) => change < 0)) &&
    changes.map(Math.abs).every((change) => change >= 1 && change <= 3)
  );
}

let safeReports = 0;
for (const report of reports) {
  if (getVariants(report).some(isSafe)) {
    safeReports++;
  }
}

console.log(`Safe reports: ${safeReports}`);
