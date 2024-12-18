import { puzzlePath } from "./path/puzzle";
import { dataPath } from "./path/data";

const dataFile = Bun.file(dataPath);

if (await dataFile.exists()) {
  console.warn(`File "${dataPath}" already exists.`);
} else {
  await Bun.write(dataFile, "");
}

const puzzleFile = Bun.file(puzzlePath);

if (await puzzleFile.exists()) {
  console.warn(`File "${puzzlePath}" already exists.`);
} else {
  await Bun.write(puzzleFile, "");
}
