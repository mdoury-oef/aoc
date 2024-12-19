import { load } from "lib/load";

const [patterns, designs] = await load({
  lineSeparator: /\n\n/,
  separator: /,\s|\n/,
});

const maxLength = Math.max(...patterns.map((pattern) => pattern.length));
const patternSet = new Set(patterns);
const cache: Record<string, number> = {};

function variantsCount(design: string) {
  if (design === "") return 1;
  if (design in cache) return cache[design];

  let count = 0;
  for (let l = 1; l < Math.min(maxLength, design.length) + 1; l++) {
    if (patternSet.has(design.slice(0, l))) {
      count += variantsCount(design.slice(l));
    }
  }

  cache[design] = count;
  return count;
}

console.log(
  designs.reduce((count, design) => count + variantsCount(design), 0),
);
