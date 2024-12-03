import { load } from "lib/load";

const data = await load();

const digits = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

function isDigit(value: string): value is keyof typeof digits {
  return value in digits;
}

function getDigit(value: string) {
  if (isDigit(value)) {
    return digits[value];
  }

  return value;
}

function getCalibrationDigits(value: string) {
  const regexp = `\\d|${Object.keys(digits).join("|")}`;

  const [first] = value.match(new RegExp(regexp)) ?? [];
  const [_, last] = value.match(new RegExp(`.*(${regexp})`)) ?? [];

  if (!first || !last) throw new Error(`Unable to parse entry "${value}".`);

  return [getDigit(first), getDigit(last)] as const;
}

const calibrationValues = data.map(([entry]) => {
  const [first, last] = getCalibrationDigits(entry);

  return Number(`${first}${last}`);
});

let total = 0;
for (const value of calibrationValues) {
  total += value;
}

console.log(`Total calibration value: ${total}`);
