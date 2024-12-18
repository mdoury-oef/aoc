import { options } from "./options";
import { puzzlePath } from "./path/puzzle";

if (await Bun.file(puzzlePath).exists()) {
  await import(puzzlePath);
} else {
  console.error(`No solution found for puzzle #${options.puzzle} of day ${options.day}.
-> File "${puzzlePath}" does not exist.`);
}
