import { load } from "lib/load";

const map = await load({ parse: Number, separator: new RegExp("") });

type Coordinates = { y: number; x: number };

type TopologicalMap = Array<Array<number>>;

function findSquare(map: TopologicalMap, square: number) {
  const matches = [];
  for (const y of map.keys()) {
    for (const x of map[y].keys()) {
      if (map[y][x] === square) {
        matches.push({ y, x });
      }
    }
  }
  return matches;
}

function isValidMove(position: Coordinates, next: Coordinates) {
  return (
    next.y >= 0 &&
    next.y < map.length &&
    next.x >= 0 &&
    next.x < map[0].length &&
    map[next.y][next.x] - map[position.y][position.x] === 1
  );
}

type Direction = "up" | "down" | "left" | "right";
const directions = [
  { name: "up", move: ({ y, x }: Coordinates) => ({ y: y - 1, x }) },
  { name: "down", move: ({ y, x }: Coordinates) => ({ y: y + 1, x }) },
  { name: "left", move: ({ y, x }: Coordinates) => ({ y, x: x - 1 }) },
  { name: "right", move: ({ y, x }: Coordinates) => ({ y, x: x + 1 }) },
] as const;

const startSquares = findSquare(map, 0);

type Path = Array<Direction>;

function move(position: Coordinates, path: Path): Array<Coordinates> {
  if (map[position.y][position.x] === 9) {
    return [position];
  }

  const possibleDirections = directions.filter((direction) =>
    isValidMove(position, direction.move(position)),
  );

  if (!possibleDirections.length) {
    return [];
  }

  return possibleDirections.flatMap((direction) =>
    move(direction.move(position), [...path, direction.name]),
  );
}

const trailheads = startSquares.flatMap((start) => ({
  start,
  ends: move(start, []),
}));

const variants = new Set(
  trailheads.flatMap(({ start, ends }) =>
    ends.map((end) => `(${start.y},${start.x})-(${end.y},${end.x})`),
  ),
);

console.log(`There are ${variants.size} possible routes.`);
