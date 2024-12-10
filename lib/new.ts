import { puzzlePath } from "./path/puzzle";
import { dataPath } from "./path/data";
import { writeFile } from "fs/promises";
import { existsSync } from "fs";

if (!existsSync(dataPath)) {
  await writeFile(dataPath, "");
} else {
  console.warn(`File "${dataPath}" already exists.`);
}

if (!existsSync(puzzlePath)) {
  await writeFile(puzzlePath, "");
} else {
  console.warn(`File "${puzzlePath}" already exists.`);
}
