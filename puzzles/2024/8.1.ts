import { load } from "lib/load";

const data = await load({ separator: new RegExp("") });

const height = data.length;
const width = data[0].length;

type Coordinates = { y: number; x: number };

function formatCoordinates({ y, x }: Coordinates) {
  return `${y}-${x}`;
}

function isValid({ y, x }: Coordinates) {
  return y >= 0 && y < height && x >= 0 && x < width;
}

const antennaFrequencyMap = new Map<string, Array<Coordinates>>();

for (const [y, line] of data.entries()) {
  for (const [x, square] of line.entries()) {
    if (square !== ".") {
      const c = antennaFrequencyMap.get(square) ?? [];
      antennaFrequencyMap.set(square, [...c, { y, x }]);
    }
  }
}

const antinodeSet = new Set<string>();

for (const antennas of antennaFrequencyMap.values()) {
  for (const [index, a] of antennas.entries()) {
    for (const b of antennas.slice(index + 1)) {
      const antinodes = [
        { y: 2 * a.y - b.y, x: 2 * a.x - b.x },
        { y: 2 * b.y - a.y, x: 2 * b.x - a.x },
      ];
      for (const antinode of antinodes) {
        if (isValid(antinode)) {
          antinodeSet.add(formatCoordinates(antinode));
        }
      }
    }
  }
}

console.log(`There are ${antinodeSet.size} unique antinodes`);
