import { load } from "lib/load";

const map = await load({ separator: new RegExp("") });

const directions = {
  ">": { dx: 1, dy: 0 },
  "^": { dx: 0, dy: 1 },
  "<": { dx: -1, dy: 0 },
  v: { dx: 0, dy: -1 },
};

type Direction = keyof typeof directions;

const startY = map.findIndex((row) => row.includes("S"));
const startX = map[startY].findIndex((col) => col === "S");
const start = { x: startX, y: startY, dir: ">" as const, path: [], cost: 0 };

const endY = map.findIndex((row) => row.includes("E"));
const endX = map[endY].findIndex((col) => col === "E");
const end = { x: endX, y: endY, dir: ">" as const, path: [], cost: Infinity };

type GraphNode = {
  x: number;
  y: number;
  dir: Direction;
  path: string[];
  cost: number;
};

const moves = [">", "v", "<", "^"] as const;

function nextDirections(direction: Direction) {
  const index = moves.indexOf(direction);
  return [
    moves[index],
    moves[(index + 1) % moves.length],
    moves[(index - 1 + moves.length) % moves.length],
  ];
}

function findOptimalPaths(start: GraphNode, end: GraphNode) {
  const queue: GraphNode[] = [start];
  const previousCost: Record<string, number> = {};
  let paths = new Array<string[]>();
  let cost = Infinity;

  while (queue.length) {
    const item = queue.shift();

    if (!item) throw new Error("Something went wrong");

    item.path.push(`${item.x}_${item.y}`);

    const key = `${item.x}_${item.y}_${item.dir}`;
    if ((previousCost[key] ?? Infinity) < item.cost) continue;
    previousCost[key] = item.cost;

    if (item.cost > cost) continue;

    if (item.x === end.x && item.y === end.y) {
      if (item.cost === cost) {
        paths.push(item.path);
      } else {
        paths = [];
        cost = item.cost;
      }
      continue;
    }

    for (const nextDir of nextDirections(item.dir)) {
      const { dy, dx } = directions[nextDir];

      if (map[item.y + dy][item.x + dx] === "#") continue;

      queue.push({
        x: item.x + dx,
        y: item.y + dy,
        dir: nextDir,
        path: item.path.slice(),
        cost: item.cost + (nextDir === item.dir ? 1 : 1001),
      });
    }
  }
  return { paths };
}

const { paths } = findOptimalPaths(start, end);

const common: Record<string, boolean> = {};
for (const path of paths) {
  for (const c of path) {
    common[c] = true;
  }
}

console.log(Object.values(common).length);
