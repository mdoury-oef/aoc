import { join } from "path";
import { fileURLToPath } from "url";
import { options } from "../options";

const dirname = fileURLToPath(new URL(".", import.meta.url));

export const puzzlePath = join(
  dirname,
  `../../puzzles/${options.year}/${options.day}.${options.puzzle}.ts`,
);
