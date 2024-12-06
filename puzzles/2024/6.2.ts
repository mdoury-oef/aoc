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

function walk(grid: string[][], position: Coordinates) {
  const path = structuredClone(grid);
  path[position.y][position.x] = "X";
  let next: Coordinates;

  while (isValid(position)) {
    let direction = grid[position.y][position.x];

    if (!isDirection(direction)) break;

    grid[position.y][position.x] = ".";

    next = directionMap[direction](position);

    if (!isValid(next)) {
      break;
    }

    if (grid[next.y][next.x] === "#") {
      direction = nextDirectionMap[direction];

      if (!isDirection(direction)) break;

      next = directionMap[direction](position);
    }

    position = next;
    grid[position.y][position.x] = direction;
    path[position.y][position.x] = "X";
  }

  return path;
}

function isLoop(grid: string[][], position: Coordinates) {
  let next = { x: -1, y: -1 };
  const path = grid.map((line) => line.map((_) => new Array<string>()));

  path[position.y][position.x].push(grid[position.y][position.x]);

  while (isValid(position)) {
    let direction = grid[position.y][position.x];

    if (!isDirection(direction)) {
      throw new Error(`Invalid direction "${direction}"`);
    }

    grid[position.y][position.x] = ".";

    next = directionMap[direction](position);

    if (!isValid(next)) {
      break;
    }

    while (grid[next.y][next.x] === "#") {
      direction = nextDirectionMap[direction];

      if (!isDirection(direction)) {
        throw new Error(`Invalid direction "${direction}"`);
      }

      next = directionMap[direction](position);
    }

    position = next;
    grid[position.y][position.x] = direction;

    if (path[position.y][position.x].includes(direction)) {
      return true;
    }

    path[position.y][position.x].push(direction);
  }

  return;
}

const y = grid.findIndex((line) => line.find(isDirection));
const x = grid[y].findIndex(isDirection);

let position = { y, x };

let count = 0;
let not = 0;
let g: typeof grid;
const path = walk(structuredClone(grid), structuredClone(position));
for (let j = 0; j < size.y; j++) {
  for (let i = 0; i < size.x; i++) {
    if (!(j === position.y && i === position.x)) {
      if (path[j][i] === "X") {
        g = structuredClone(grid);
        g[j][i] = "#";
        if (isLoop(g, structuredClone(position))) {
          count++;
        }
      }
    }
  }
}

console.log(`There are ${count}, ${not} position creating a loop.`);
