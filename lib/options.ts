import { parseArgs } from "util";

export const { values: options } = parseArgs({
  options: {
    year: {
      type: "string",
      short: "y",
      default: new Date().getFullYear().toString(),
    },
    day: {
      type: "string",
      short: "d",
      default: new Date().getDate().toString(),
    },
    puzzle: {
      type: "string",
      short: "p",
      default: "1",
    },
  },
  args: process.argv.slice(2),
  strict: true,
});
