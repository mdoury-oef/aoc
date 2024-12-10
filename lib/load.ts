import { readFile } from "node:fs/promises";
import { dataPath } from "./path/data";

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
  const file = await readFile(dataPath, { encoding: "utf8" });
  const lines = file.split("\n");
  const entries = lines
    .slice(0, lines.length - 1)
    .map((line) => line.split(separator).filter(Boolean).map(parse));

  return entries;
}
