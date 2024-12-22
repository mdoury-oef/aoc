import { load } from "lib/load";

const codes = await load({ separator: new RegExp("") });

const directions = {
  "<": { dy: 0, dx: -1 },
  v: { dy: 1, dx: 0 },
  ">": { dy: 0, dx: 1 },
  "^": { dy: -1, dx: 0 },
};

type Direction = keyof typeof directions;

function zip(a: string, b: string) {
  const arr = [];
  for (let i = 0; i < a.length; i++) {
    if (i < b.length) {
      arr.push(a.charAt(i) + b.charAt(i));
    }
  }
  return arr;
}

function crossProduct(a: Array<string>, b: Array<string>) {
  return a.reduce<Array<string>>((acc, x) => {
    return [...acc, ...b.map((y) => x + y)];
  }, []);
}

function solve(code: string, keypad: Record<string, Record<string, string[]>>) {
  const pairs = zip("A" + code, code).map(([prev, next]) => keypad[prev][next]);
  const paths = pairs.reduce<Array<string>>((acc, arr, index) => {
    if (index === 0) return arr;
    return crossProduct(acc, arr);
  }, []);
  return paths;
}

function findPaths(keypad: Array<Array<string | null>>) {
  const paths: Record<string, Record<string, string[]>> = {};
  for (const [startY, startRow] of keypad.entries()) {
    for (const [startX, startKey] of startRow.entries()) {
      for (const [endY, endRow] of keypad.entries()) {
        for (const [endX, endKey] of endRow.entries()) {
          if (!startKey || !endKey) continue;
          if (!(startKey in paths)) {
            paths[startKey] = {};
          }
          if (!(endKey in paths[startKey])) {
            paths[startKey][endKey] = [];
          }
          if (endKey === startKey) {
            paths[startKey][endKey].push("A");
            continue;
          }
          const my = endY - startY;
          const mx = endX - startX;
          const moves: Array<Direction> = [];
          if (my > 0) {
            moves.push("v");
          } else {
            moves.push("^");
          }
          if (mx > 0) {
            moves.push(">");
          } else {
            moves.push("<");
          }
          const queue = [{ y: 0, x: 0, path: "" }];
          while (queue.length) {
            const item = queue.shift()!;
            for (const move of moves) {
              const { dy, dx } = directions[move];
              const ny = item.y + dy;
              const nx = item.x + dx;
              if (ny === my && nx === mx) {
                paths[startKey][endKey].push(item.path.concat(move + "A"));
                break;
              }
              if (Math.abs(ny) > Math.abs(my) || Math.abs(nx) > Math.abs(mx)) {
                continue;
              }
              if (keypad[startY + ny][startX + nx] === null) continue;
              queue.push({ y: ny, x: nx, path: item.path.concat(move) });
            }
          }
        }
      }
    }
  }
  return paths;
}

const numericKeypad = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  [null, "0", "A"],
];

const directionalKeypad = [
  [null, "^", "A"],
  ["<", "v", ">"],
];

const numericPaths = findPaths(numericKeypad);
const directionalPaths = findPaths(directionalKeypad);

const cache: Record<string, number> = {};

function getMinLength(from: string, to: string, depth: number) {
  if (depth === 1) return directionalPaths[from][to][0].length;

  const id = `${from}_${to}_${depth}`;

  if (id in cache) return cache[id];

  let min = Infinity;
  for (const path of directionalPaths[from][to]) {
    let length = 0;
    for (const pair of zip("A" + path, path)) {
      length += getMinLength(pair.charAt(0), pair.charAt(1), depth - 1);

      if (length > min) break;
    }

    if (length < min) {
      min = length;
    }
  }
  cache[id] = min;
  return min;
}

let res = 0;
for (const code of codes.map((c) => c.join(""))) {
  let min = Infinity;
  const numericValue = Number(code.slice(0, -1));
  const paths = solve(code, numericPaths);
  for (const path of paths) {
    let length = 0;
    for (const dir of zip("A" + path, path)) {
      length += getMinLength(dir.charAt(0), dir.charAt(1), 2);
      if (length > min) {
        break;
      }
    }
    if (length < min) {
      min = length;
    }
  }
  res += min * numericValue;
}

console.log(res);
