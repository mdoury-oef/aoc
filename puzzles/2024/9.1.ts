import { load } from "lib/load";

const data = await load({ parse: Number, separator: new RegExp("") });

const parsed = new Array<Array<"." | number>>();
for (const [row, disk] of data.entries()) {
  parsed.push([]);
  for (const [col, data] of disk.entries()) {
    if (col % 2 === 0) {
      parsed[row].push(...new Array<number>(data).fill(col / 2));
    } else {
      parsed[row].push(...new Array<".">(data).fill("."));
    }
  }
}

let checksum = 0;
for (const [row, disk] of parsed.entries()) {
  for (const [col, data] of [...disk.entries()].reverse()) {
    if (data === ".") continue;
    const freeCol = disk.findIndex((v) => v === ".");
    if (freeCol === -1 || freeCol > col) continue;
    parsed[row][freeCol] = data;
    parsed[row][col] = ".";
  }
  for (const [col, data] of disk.entries()) {
    if (data === ".") continue;
    checksum += col * data;
  }
}

console.log(`The checksum is ${checksum}`);
