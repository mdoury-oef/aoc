import { load } from "lib/load";

const data = await load();
const grid = data.flatMap((entry) => entry.map((line) => line.split("")));

const height = grid.length;
const width = grid[0].length;

const search = "XMAS";

type Coordinates = { x: number; y: number };
type Direction = {
  name: string;
  isEdge(coordinates: Coordinates): boolean;
  move(coordinates: Coordinates): Coordinates;
};

const isEdge = {
  start(position: number) {
    return position >= search.length - 1;
  },
  end(position: number, max: number) {
    return position + search.length <= max;
  },
};

const directions = [
  {
    name: "top",
    isEdge: ({ y }) => isEdge.start(y),
    move: ({ x, y }) => ({ x, y: y - 1 }),
  },
  {
    name: "bottom",
    isEdge: ({ y }) => isEdge.end(y, height),
    move: ({ x, y }) => ({ x, y: y + 1 }),
  },
  {
    name: "left",
    isEdge: ({ x }) => isEdge.start(x),
    move: ({ x, y }) => ({ x: x - 1, y }),
  },
  {
    name: "right",
    isEdge: ({ x }) => isEdge.end(x, width),
    move: ({ x, y }) => ({ x: x + 1, y }),
  },
  {
    name: "top-left",
    isEdge: ({ x, y }) => isEdge.start(x) && isEdge.start(y),
    move: ({ x, y }) => ({ x: x - 1, y: y - 1 }),
  },
  {
    name: "top-right",
    isEdge: ({ x, y }) => isEdge.end(x, width) && isEdge.start(y),
    move: ({ x, y }) => ({ x: x + 1, y: y - 1 }),
  },
  {
    name: "bottom-left",
    isEdge: ({ x, y }) => isEdge.start(x) && isEdge.end(y, height),
    move: ({ x, y }) => ({ x: x - 1, y: y + 1 }),
  },
  {
    name: "bottom-right",
    isEdge: ({ x, y }) => isEdge.end(x, width) && isEdge.end(y, height),
    move: ({ x, y }) => ({ x: x + 1, y: y + 1 }),
  },
] satisfies Array<Direction>;

let count = 0;

for (const [x, line] of grid.entries()) {
  for (const [y, letter] of line.entries()) {
    if (letter === search[0]) {
      for (const direction of directions) {
        if (direction.isEdge({ x, y })) {
          let c = { x, y };
          let letters = search[0];
          let match = true;

          for (const letter of search.split("").slice(1)) {
            c = direction.move(c);
            match = grid[c.x][c.y] === letter;
            if (!match) break;
            letters += letter;
          }

          if (match) {
            count++;
          }
        }
      }
    }
  }
}

console.log(`Found "${search}" ${count} times in the grid.`);
