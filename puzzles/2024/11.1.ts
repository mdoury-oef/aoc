import { load } from "lib/load";

const rows = await load({ parse: Number, separator: new RegExp(" ") });

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

const BLINKS = 25;

for (let row of rows) {
  for (const _ of new Array(BLINKS)) {
    const next = [];
    for (const stone of row) {
      next.push(...transform(stone));
    }
    row = next;
  }
  console.log(row.length);
}
