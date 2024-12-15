import { load } from "lib/load";
import c from "yoctocolors";

let data = await load({ lineSeparator: /\n\n/ });

const map = data[0].map((row) =>
  row.split("").flatMap((square) => {
    switch (square) {
      case "#": {
        return ["#", "#"];
      }
      case "O": {
        return ["[", "]"];
      }
      case ".": {
        return [".", "."];
      }
      case "@": {
        return ["@", "."];
      }
      default: {
        throw new Error(`Unknown item: "${square}"`);
      }
    }
  }),
);
const moves = data[1].join("");

draw(map);

const startY = map.findIndex((row) => row.includes("@"));
const startX = map[startY].findIndex((square) => square === "@");

const position = {
  y: startY,
  x: startX,
};

const directions = {
  "<": { dy: 0, dx: -1 },
  ">": { dy: 0, dx: 1 },
  v: { dy: 1, dx: 0 },
  "^": { dy: -1, dx: 0 },
};

type Direction = keyof typeof directions;

function draw(map: string[][]) {
  console.log(
    map
      .map((row) => row.join(""))
      .join("\n")
      .replaceAll("[", c.blue("["))
      .replaceAll("]", c.blue("]"))
      .replace("@", c.yellow("@")) + "\n",
  );
}

for (const move of moves) {
  const { dy, dx } = directions[move as Direction];
  const targets = [position];
  let canMove = true;

  for (const t of targets) {
    const n = {
      y: t.y + dy,
      x: t.x + dx,
    };

    switch (map[n.y][n.x]) {
      case "#": {
        canMove = false;
        break;
      }
      case "[": {
        if (!targets.some((t) => t.y === n.y && t.x === n.x)) {
          targets.push(n);
        }
        if (!targets.some((t) => t.y === n.y && t.x === n.x + 1)) {
          targets.push({ y: n.y, x: n.x + 1 });
        }
        break;
      }
      case "]": {
        if (!targets.some((t) => t.y === n.y && t.x === n.x)) {
          targets.push(n);
        }
        if (!targets.some((t) => t.y === n.y && t.x === n.x - 1)) {
          targets.push({ y: n.y, x: n.x - 1 });
        }
        break;
      }
    }
  }

  if (!canMove) continue;

  for (const t of targets.reverse()) {
    map[t.y + dy][t.x + dx] = map[t.y][t.x];
    map[t.y][t.x] = ".";
  }

  position.y += dy;
  position.x += dx;
}

draw(map);

let total = 0;
for (const [y, row] of map.entries()) {
  for (const [x, square] of row.entries()) {
    if (square !== "[") continue;
    total += 100 * y + x;
  }
}
console.log(total);
