import { load } from "lib/load";

const data = new Map(
  (await load({
    parse(v, i) {
      if (i === 0) {
        return Number(v);
      }
      return v.split(" ").map(Number);
    },
    separator: new RegExp(": "),
  })) as Array<[number, number[]]>,
);

const operations = [
  function add(a: number, b: number) {
    return a + b;
  },
  function multiply(a: number, b: number) {
    return a * b;
  },
  function combine(a: number, b: number) {
    return Number(a.toString() + b.toString());
  },
] as const;

let sum = 0;
for (const [result, numbers] of data) {
  const combinations = numbers.reduce((combinations, n, index) => {
    if (index < numbers.length - 1) {
      const previous = combinations[index - 1] ?? [n];
      const c = [];
      for (const a of previous) {
        const b = numbers[index + 1];
        c.push(operations.map((operation) => operation(a, b)));
      }
      combinations.push(c.flat());
    }
    return combinations;
  }, new Array<number[]>());

  if (combinations[combinations.length - 1].includes(result)) {
    sum += result;
  }
}

console.log(`The total calibration result is ${sum}`);
