import { load } from "lib/load";

const map = await load({ separator: new RegExp("") });

type Coordinates = {
  y: number;
  x: number;
};

type Direction = "bottom" | "top" | "right" | "left";

type Edge = {
  c: {
    y: number;
    x: number;
  };
  region: string | null;
  direction: Direction;
};

const directions = {
  bottom: {
    direction: "bottom",
    move: ({ y, x }: Coordinates) => ({ y: y + 1, x }),
    opposite: ["left", "right"],
    orientation: "vertical",
  },
  top: {
    direction: "top",
    move: ({ y, x }: Coordinates) => ({ y: y - 1, x }),
    opposite: ["left", "right"],
    orientation: "vertical",
  },
  right: {
    direction: "right",
    move: ({ y, x }: Coordinates) => ({ y, x: x + 1 }),
    opposite: ["top", "bottom"],
    orientation: "horizontal",
  },
  left: {
    direction: "left",
    move: ({ y, x }: Coordinates) => ({ y, x: x - 1 }),
    opposite: ["top", "bottom"],
    orientation: "horizontal",
  },
} as const;

function format(c: Coordinates) {
  return `${c.y};${c.x}`;
}

function split(c: string) {
  const [y, x] = c.split(";").map(Number);
  return { y, x };
}

function isValid(c: Coordinates) {
  return c.y in map && c.x in map[c.y];
}

function neighborEdgesOf(coordinates: Coordinates) {
  return Object.values(directions).flatMap(({ move, direction }) => {
    const c = move(coordinates);
    return {
      c,
      direction,
      region: isValid(c) ? map[c.y][c.x] : null,
    };
  });
}

function edgesOf(c: string) {
  const coordinates = split(c);
  const edges = new Array<Edge>();
  const neighborEdges = neighborEdgesOf(coordinates);
  for (const edge of neighborEdges) {
    if (!isValid(edge.c) || map[coordinates.y][coordinates.x] !== edge.region) {
      edges.push(edge);
    }
  }
  return edges;
}

function getExploration(c: Coordinates, direction: Direction) {
  return `position:${format(c)}_edge:${direction}`;
}

function storeExploration(
  sides: Array<Set<string>>,
  exploration: string,
  groupWith = exploration,
) {
  const side = sides.find((side) => side.has(groupWith));

  if (side) {
    side.add(exploration);
  } else {
    sides.push(new Set([exploration]));
  }
}

function sidesOf(region: Set<string>) {
  const edgeMap = new Map<string, Array<Edge>>();
  for (const c of region) {
    const edges = edgesOf(c);
    edgeMap.set(c, edges);
  }

  const sides = new Array<Set<string>>();

  for (const [c, edges] of edgeMap) {
    const coordinates = split(c);

    for (const edge of edges) {
      storeExploration(sides, getExploration(coordinates, edge.direction));

      for (const direction of directions[edge.direction].opposite) {
        let position = coordinates;
        let exploration = {
          current: getExploration(coordinates, edge.direction),
          previous: "",
        };

        while (true) {
          position = directions[direction].move(position);

          if (
            !edgeMap
              .get(format(position))
              ?.some((e) => e.direction === edge.direction)
          ) {
            break;
          }
          exploration = {
            previous: exploration.current,
            current: getExploration(position, edge.direction),
          };

          storeExploration(sides, exploration.current, exploration.previous);
        }
      }
    }
  }
  return sides.length;
}

function regionOf(
  c: Coordinates,
  exploration = {
    region: new Set([format(c)]),
    explored: new Set([format(c)]),
  },
) {
  const neighborEdges = neighborEdgesOf(c).filter(
    (edge) =>
      !exploration.explored.has(format(edge.c)) &&
      edge.region &&
      map[edge.c.y][edge.c.x] === map[c.y][c.x],
  );
  for (const neighbor of neighborEdges) {
    exploration.explored.add(format(neighbor.c));
    if (neighbor.region === map[c.y][c.x]) {
      exploration.region.add(format(neighbor.c));
    }
    exploration = regionOf(neighbor.c, exploration);
  }
  return exploration;
}

const regions = new Array<Set<string>>();
const sides = new Map<Set<string>, number>();

for (const [y, row] of map.entries()) {
  for (const x of row.keys()) {
    if (!regions.some((r) => r.has(format({ y, x })))) {
      const region = regionOf({ y, x }).region;
      regions.push(region);
      sides.set(region, sidesOf(region));
    }
  }
}

let price = 0;
for (const region of regions) {
  price += region.size * (sides.get(region) ?? 0);
}

console.log(`The total price is ${price}`);
