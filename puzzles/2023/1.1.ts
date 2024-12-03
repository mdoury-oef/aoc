import { load } from "lib/load";

const data = await load();

const calibrationValues = data.map(([entry]) => {
  const numbers = entry.replaceAll(/[a-zA-Z]/g, "");
  const first = numbers[0];
  const last = numbers[numbers.length - 1];
  return Number(`${first}${last}`);
});

let total = 0;
for (const value of calibrationValues) {
  total += value;
}

console.log(`Total calibration value: ${total}`);
