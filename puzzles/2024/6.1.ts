import { load } from "lib/load";

const grid = await load({ separator: new RegExp("") });

const size = { y: grid.length, x: grid[0].length };

type Coordinates = { x: number; y: number };

const directionMap = {
  "^": ({ x, y }: Coordinates) => ({ x, y: y - 1 }),
  ">": ({ x, y }: Coordinates) => ({ x: x + 1, y }),
  v: ({ x, y }: Coordinates) => ({ x, y: y + 1 }),
  "<": ({ x, y }: Coordinates) => ({ x: x - 1, y }),
} as const;

const nextDirectionMap = {
  "^": ">",
  ">": "v",
  v: "<",
  "<": "^",
} as const;

const directions = Object.keys(directionMap);

function isDirection(d: string): d is keyof typeof directionMap {
  return directions.includes(d);
}

function isValid(c: Coordinates) {
  return 0 <= c.y && c.y < size.y && 0 <= c.x && c.x < size.x;
}

const y = grid.findIndex((line) => line.find(isDirection));
const x = grid[y].findIndex(isDirection);

let position = { y, x };

const path = structuredClone(grid);
path[position.y][position.x] = "X";

while (isValid(position)) {
  let direction = grid[position.y][position.x];

  if (!isDirection(direction)) break;

  grid[position.y][position.x] = ".";

  let next = directionMap[direction](position);

  if (!isValid(next)) break;

  if (grid[next.y][next.x] === "#") {
    direction = nextDirectionMap[direction];

    if (!isDirection(direction)) break;

    next = directionMap[direction](position);
  }

  position = next;
  grid[position.y][position.x] = direction;
  path[position.y][position.x] = "X";
}

console.log(path.map((lines) => lines.join("")).join("\n") + "\n");

const count = path
  .map((lines) => lines.join(""))
  .join("")
  .replaceAll(/[^X]/g, "").length;

console.log(`The guard visitid ${count} positions.`);
