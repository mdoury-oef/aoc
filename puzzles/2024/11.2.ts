import { load } from "lib/load";

const rows = await load({ parse: Number });
const maps = rows.map((row) =>
  row.reduce((map, number) => {
    const occurences = map.get(number);
    if (occurences) {
      map.set(number, occurences + 1);
    } else {
      map.set(number, 1);
    }
    return map;
  }, new Map<number, number>()),
);

function transform(stone: number) {
  const str = stone.toString();
  switch (true) {
    case str === "0": {
      return [1];
    }
    case str.length % 2 === 0: {
      const middle = str.length / 2;
      return [Number(str.slice(0, middle)), Number(str.slice(middle))];
    }
    default: {
      return [stone * 2024];
    }
  }
}

const BLINKS = 75;

for (let row of maps) {
  for (const _ of new Array(BLINKS)) {
    const next = new Map<number, number>();
    for (const [stone, occurences] of row) {
      for (const transformed of transform(stone)) {
        next.set(transformed, (next.get(transformed) ?? 0) + occurences);
      }
    }
    row = next;
  }
  console.log(
    [...row.values()].reduce((sum, occurences) => sum + occurences, 0),
  );
}
