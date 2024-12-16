import { load } from "lib/load";

const map = await load({ separator: new RegExp("") });

const moves = {
  ">": { dx: 1, dy: 0 },
  "^": { dx: 0, dy: 1 },
  "<": { dx: -1, dy: 0 },
  v: { dx: 0, dy: -1 },
};

type Direction = keyof typeof moves;

const startY = map.findIndex((row) => row.includes("S"));
const startX = map[startY].findIndex((col) => col === "S");
const start = { x: startX, y: startY, dir: ">" as const, cost: 0 };

const endY = map.findIndex((row) => row.includes("E"));
const endX = map[endY].findIndex((col) => col === "E");
const end = { x: endX, y: endY, dir: ">" as const, cost: Infinity };

type GraphNode = {
  x: number;
  y: number;
  dir: Direction;
  cost: number;
};

const directions = [">", "v", "<", "^"] as const;

function nextDirections(direction: Direction) {
  const index = directions.indexOf(direction);
  return [
    directions[index],
    directions[(index + 1) % directions.length],
    directions[(index - 1 + directions.length) % directions.length],
  ];
}

function findOptimalCost(start: GraphNode, end: GraphNode) {
  const queue: GraphNode[] = [start];
  const previousCost: Record<string, number> = {};
  let cost = Infinity;

  while (queue.length) {
    const item = queue.shift();
    if (!item) throw new Error("Something went wrong");

    const key = `${item.x}_${item.y}`;
    if ((previousCost[key] ?? Infinity) < item.cost) continue;
    previousCost[key] = item.cost;

    if (item.cost > cost) continue;

    if (item.x === end.x && item.y === end.y) {
      cost = item.cost;
      continue;
    }

    for (const nextDir of nextDirections(item.dir)) {
      const { dy, dx } = moves[nextDir];

      if (map[item.y + dy][item.x + dx] === "#") continue;

      queue.push({
        x: item.x + dx,
        y: item.y + dy,
        dir: nextDir,
        cost: item.cost + (nextDir === item.dir ? 1 : 1001),
      });
    }
  }
  return { cost };
}

const { cost } = findOptimalCost(start, end);

console.log(cost);
