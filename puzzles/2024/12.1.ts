import { load } from "lib/load";

const map = await load({ separator: new RegExp("") });

type Coordinates = {
  y: number;
  x: number;
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
  return `${c.y}-${c.x}`;
}

function split(c: string) {
  const [y, x] = c.split("-").map(Number);
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

function perimeterOf(region: Set<string>) {
  let perimeter = 0;
  for (const coordinates of region) {
    const c = split(coordinates);
    for (const neighbor of neighborEdgesOf(c)) {
      if (neighbor.region !== map[c.y][c.x]) {
        perimeter++;
      }
    }
  }
  return perimeter;
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
const perimeters = new Map<Set<string>, number>();

for (const [y, row] of map.entries()) {
  for (const x of row.keys()) {
    if (!regions.some((r) => r.has(format({ y, x })))) {
      const current = regionOf({ y, x }).region;
      regions.push(current);
      perimeters.set(current, perimeterOf(current));
    }
  }
}

let price = 0;
for (const region of regions) {
  price += region.size * (perimeters.get(region) ?? 0);
}

console.log(`The total price is ${price}`);
