import { dataPath } from "./path/data";

type LoadOptions<TOut> = {
  parse?(value: string, index: number, array: string[]): TOut;
  separator?: RegExp;
  lineSeparator?: RegExp;
};

function identity<TInput, TOutput>(value: TInput): TOutput;
function identity<TValue>(value: TValue): TValue {
  return value;
}

export async function load<TOut = string>({
  parse = identity,
  separator = /\s/,
  lineSeparator = /\n/,
}: LoadOptions<TOut> = {}) {
  const file = await Bun.file(dataPath).text();
  let lines = file.split(lineSeparator);
  if (!lines[lines.length - 1]) {
    lines = lines.slice(0, -1);
  }
  const entries = lines.map((line) =>
    line.split(separator).filter(Boolean).map(parse),
  );

  return entries;
}
