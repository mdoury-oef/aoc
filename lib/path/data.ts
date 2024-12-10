import { options } from "lib/options";
import { join } from "path";
import { fileURLToPath } from "url";

const dirname = fileURLToPath(new URL(".", import.meta.url));
export const dataPath = join(
  dirname,
  `../../data/${options.year}/${options.day}.${options.puzzle}.txt`,
);
