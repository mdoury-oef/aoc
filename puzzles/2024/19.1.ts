import { load } from "lib/load";

const [patterns, designs] = await load({
  lineSeparator: /\n\n/,
  separator: /,\s|\n/,
});

const maxLength = Math.max(...patterns.map((pattern) => pattern.length));
const patternSet = new Set(patterns);
const cache: Record<string, boolean> = {};

function canBeReproduced(design: string) {
  if (design.length === 0) return true;
  if (design in cache) return cache[design];

  for (let l = 1; l < Math.min(maxLength, design.length); l++) {
    if (
      patternSet.has(design.slice(0, l + 1)) &&
      canBeReproduced(design.slice(l + 1))
    ) {
      cache[design] = true;
      return true;
    }
  }

  cache[design] = false;
  return false;
}

console.log(designs.filter(canBeReproduced).length);
