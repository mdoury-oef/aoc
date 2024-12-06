import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { options } from "./options";

type LoadOptions<TOut> = {
  parse?(value: string, index: number, array: string[]): TOut;
  separator?: RegExp;
};

function identity<TInput, TOutput>(value: TInput): TOutput;
function identity<TValue>(value: TValue): TValue {
  return value;
}

export async function load<TOut = string>({
  parse = identity,
  separator = /\s/,
}: LoadOptions<TOut> = {}) {
  const dirname = fileURLToPath(new URL(".", import.meta.url));
  const path = join(
    dirname,
    `../data/${options.year}/${options.day}.${options.puzzle}.txt`,
  );
  const file = await readFile(path, { encoding: "utf8" });
  const lines = file.split("\n");
  const entries = lines
    .slice(0, lines.length - 1)
    .map((line) => line.split(separator).filter(Boolean).map(parse));

  return entries;
}
