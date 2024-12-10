import { existsSync } from "node:fs";
import { options } from "./options";
import { puzzlePath } from "./path/puzzle";

if (existsSync(puzzlePath)) {
  await import(puzzlePath);
} else {
  console.error(`No solution found for puzzle #${options.puzzle} of day ${options.day}.
-> File "${puzzlePath}" does not exist.`);
}
