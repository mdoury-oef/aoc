import { load } from "lib/load";

const source = await load();
const program = source.flatMap((line) => line.join(" ")).join("\\n");

let sum = 0;
for (const [_, a, b] of program.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g)) {
  sum += Number(a) * Number(b);
}

console.log(`Result: ${sum}`);
