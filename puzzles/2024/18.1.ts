import { load } from "lib/load";

const bytes = await load({ separator: /,/, parse: Number });

const isTest = false;

const config = {
  size: 71,
  iterations: 1024,
};

if (isTest) {
  config.size = 7;
  config.iterations = 12;
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

const map = new Array(config.size)
  .fill([])
  .map(() => new Array(config.size).fill("-"));

for (const [x, y] of bytes.slice(0, config.iterations)) {
  map[y][x] = "#";
}

const queue = [{ y: start.y, x: start.x, d: 0 }];
const seen: Record<string, boolean> = {};

while (queue.length) {
  const item = queue.shift();
  if (!item) break;
  for (const { dy, dx } of directions) {
    const n = { y: item.y + dy, x: item.x + dx, d: item.d + 1 };
    if (n.y < 0 || n.x < 0 || n.y > config.size - 1 || n.x > config.size - 1) {
      continue;
    }
    if (map[n.y][n.x] === "#") continue;
    if (seen[`${n.y}-${n.x}`]) continue;
    if (n.y === end.y && n.x === end.x) {
      console.log(n.d);
      process.exit();
    }
    seen[`${n.y}-${n.x}`] = true;
    queue.push(n);
  }
}
