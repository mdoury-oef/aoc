import { load } from "lib/load";

const data = await load({ parse: Number });

function sortAsc(a: number, b: number) {
  return a - b;
}

const first = data.map((entry) => entry[0]).toSorted(sortAsc);
const second = data.map((entry) => entry[1]).toSorted(sortAsc);

let similarity = 0;
for (const f of first) {
  const occurences = second.filter((s) => s === f).length;
  similarity += f * occurences;
}

console.log(`Similarity: ${similarity}`);
