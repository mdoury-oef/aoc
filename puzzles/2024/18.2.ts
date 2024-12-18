import { load } from "lib/load";

const bytes = await load({ separator: /,/, parse: Number });

const isTest = false;

const config = {
  size: 71,
};

if (isTest) {
  config.size = 7;
}

const directions = [
  { dx: 1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: -1, dy: 0 },
  { dx: 0, dy: -1 },
];

type Coordinates = {
  x: number;
  y: number;
};

const start = { y: 0, x: 0 } satisfies Coordinates;

const end = {
  y: config.size - 1,
  x: config.size - 1,
} satisfies Coordinates;

function isTraversable(n: number) {
  const map = new Array(config.size)
    .fill([])
    .map(() => new Array(config.size).fill("-"));

  for (const [x, y] of bytes.slice(0, n)) {
    map[y][x] = "#";
  }

  const queue = [{ y: start.y, x: start.x }];
  const seen: Record<string, boolean> = {};

  while (queue.length) {
    const item = queue.shift();
    if (!item) break;
    for (const { dy, dx } of directions) {
      const n = { y: item.y + dy, x: item.x + dx };
      if (
        n.y < 0 ||
        n.x < 0 ||
        n.y > config.size - 1 ||
        n.x > config.size - 1
      ) {
        continue;
      }
      if (map[n.y][n.x] === "#") continue;
      if (seen[`${n.y}-${n.x}`]) continue;
      if (n.y === end.y && n.x === end.x) return true;
      seen[`${n.y}-${n.x}`] = true;
      queue.push(n);
    }
  }
  return false;
}

let min = 0;
let max = bytes.length - 1;

while (min < max) {
  const n = ((min + max) / 2) | 0;
  if (isTraversable(n + 1)) {
    min = n + 1;
  } else {
    max = n;
  }
}

console.log(bytes[min].join(","));
