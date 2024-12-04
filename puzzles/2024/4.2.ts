import { load } from "lib/load";

const data = await load();
const grid = data.flatMap((entry) => entry.map((line) => line.split("")));

const height = grid.length;
const width = grid[0].length;

const search = "MAS";
const middle = (search.length - 1) / 2;

type Coordinates = { x: number; y: number };
type DirectionName = "\\" | "//";
type Direction = {
  name: DirectionName;
  move(coordinates: Coordinates, distance?: number): Coordinates;
};

function isEdge({ x, y }: Coordinates) {
  return (
    y - middle < 0 ||
    y + middle >= height ||
    x - middle < 0 ||
    x + middle >= width
  );
}

const directions = [
  {
    name: "\\",
    move: ({ x, y }, d = 1) => ({ x: x - d, y: y + d }),
  },
  {
    name: "//",
    move: ({ x, y }, d = 1) => ({ x: x + d, y: y + d }),
  },
] satisfies Array<Direction>;

const orientations = [1, -1] as const;

function createOrientationMap(coordinates: Coordinates, direction: Direction) {
  return new Map(
    orientations.map((orientation) => [
      orientation,
      {
        match: true,
        coordinates: direction.move(coordinates, -orientation * middle),
      },
    ]),
  );
}

let count = 0;

for (const [x, line] of grid.entries()) {
  for (const [y, letter] of line.entries()) {
    if (letter === search[middle]) {
      let match = true;

      if (!isEdge({ x, y })) {
        for (const direction of directions) {
          const orientationMap = createOrientationMap({ x, y }, direction);

          for (const orientation of orientations) {
            for (const letter of search.split("")) {
              const orientationData = orientationMap.get(orientation)!;
              if (!orientationData) break;
              const { match, coordinates } = orientationData;

              orientationMap.set(orientation, {
                match: match && grid[coordinates.x][coordinates.y] === letter,
                coordinates: direction.move(coordinates, orientation),
              });
            }
          }
          match &&= [...orientationMap.values()].some(({ match }) => match);
        }

        if (match) count++;
      }
    }
  }
}

console.log(`Found X-${search} ${count} times in the grid.`);
