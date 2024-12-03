import { load } from "lib/load";

const data = await load({ parse: Number });

function sortAsc(a: number, b: number) {
  return a - b;
}

const first = data.map((entry) => entry[0]).toSorted(sortAsc);
const second = data.map((entry) => entry[1]).toSorted(sortAsc);

let distance = 0;
for (const idx of Object.keys(first)) {
  const f = first[Number(idx)];
  const s = second[Number(idx)];
  distance += Math.abs(f - s);
}

console.log(`Distance: ${distance}`);
