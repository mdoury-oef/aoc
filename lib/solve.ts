import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { existsSync } from "node:fs";
import { options } from "./options";

const dirname = fileURLToPath(new URL(".", import.meta.url));
const path = join(
  dirname,
  `../puzzles/${options.year}/${options.day}.${options.puzzle}.ts`,
);

if (existsSync(path)) {
  await import(path);
} else {
  console.error(`No solution found for puzzle #${options.puzzle} of day ${options.day}.
-> File "${path}" does not exist.`);
}
