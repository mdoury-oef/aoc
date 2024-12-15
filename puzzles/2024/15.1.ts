import { load } from "lib/load";
import c from "yoctocolors";

let data = await load({ lineSeparator: /\n\n/ });
const map = data[0].map((row) => row.split(""));
const moves = data[1].join("");

const startY = map.findIndex((row) => row.includes("@"));
const startX = map[startY].findIndex((square) => square === "@");

let position = {
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
      .replaceAll("O", c.blue("O"))
      .replace("@", c.yellow("@")) + "\n",
  );
}

draw(map);

for (const move of moves) {
  const { dy, dx } = directions[move as Direction];
  let canMove = true;
  const targets = [position];

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
      case "O": {
        targets.push(n);
        break;
      }
      case ".": {
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
    if (square !== "O") continue;
    total += 100 * y + x;
  }
}
console.log(total);
