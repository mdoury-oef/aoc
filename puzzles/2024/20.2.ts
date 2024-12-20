import { load } from "lib/load";

const map = await load({ separator: new RegExp("") });

const size = {
  y: map.length,
  x: map[0].length,
};

const moves = [
  { dy: 1, dx: 0 },
  { dy: -1, dx: 0 },
  { dy: 0, dx: 1 },
  { dy: 0, dx: -1 },
];

const diagonals = { y: [1, -1], x: [1, -1] };

const startY = map.findIndex((row) => row.includes("S"));
const startX = map[startY].indexOf("S");
const start = {
  y: startY,
  x: startX,
};

const distance = new Array(size.y)
  .fill([])
  .map(() => new Array(size.x).fill(Infinity));
distance[start.y][start.x] = 0;

let pos = { y: start.y, x: start.x };
while (map[pos.y][pos.x] !== "E") {
  for (const { dy, dx } of moves) {
    const ny = pos.y + dy;
    const nx = pos.x + dx;
    if (ny < 0 || ny >= size.y) continue;
    if (nx < 0 || nx >= size.x) continue;
    if (map[ny][nx] === "#") continue;
    if (distance[ny][nx] !== Infinity) continue;
    distance[ny][nx] = distance[pos.y][pos.x] + 1;
    pos.y = ny;
    pos.x = nx;
  }
}

let count = 0;
for (const [y, row] of map.entries()) {
  for (const [x, square] of row.entries()) {
    if (square === "#") continue;
    for (let cheatDuration = 2; cheatDuration <= 20; cheatDuration++) {
      for (let cy = 0; cy <= cheatDuration; cy++) {
        const cx = cheatDuration - cy;

        const cheats = {
          y: cy === 0 ? [y] : diagonals.y.map((dy) => y + dy * cy),
          x: cx === 0 ? [x] : diagonals.x.map((dx) => x + dx * cx),
        };

        for (const ny of cheats.y) {
          for (const nx of cheats.x) {
            if (ny < 0 || ny >= size.y) continue;
            if (nx < 0 || nx >= size.x) continue;
            if (map[ny][nx] === "#") continue;
            if (distance[y][x] - distance[ny][nx] >= 100 + cheatDuration)
              count++;
          }
        }
      }
    }
  }
}

console.log(count);
