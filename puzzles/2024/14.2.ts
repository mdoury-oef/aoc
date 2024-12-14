import { load } from "lib/load";
import readline from "node:readline/promises";

const robots = await load({
  parse(entry) {
    const [_, x, y] = entry.split(/[=,]/);
    return { x: Number(x), y: Number(y) };
  },
});

const size = {
  x: 101,
  y: 103,
};

const middle = {
  x: (size.x - 1) / 2,
  y: (size.y - 1) / 2,
};

const emptyMap = new Array<Array<string>>(size.y)
  .fill([])
  .map((_) => new Array(size.x).fill("."));

let safetyFactor = Infinity;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function draw(iteration: number) {
  const p = robots.map(([position, velocity]) => {
    let x = (position.x + iteration * velocity.x) % size.x;
    if (x < 0) {
      x += size.x;
    }

    let y = (position.y + iteration * velocity.y) % size.y;
    if (y < 0) {
      y += size.y;
    }
    return { x, y };
  });

  const factor =
    p.filter((p) => p.x < middle.x && p.y < middle.y).length *
    p.filter((p) => p.x > middle.x && p.y < middle.y).length *
    p.filter((p) => p.x < middle.x && p.y > middle.y).length *
    p.filter((p) => p.x > middle.x && p.y > middle.y).length;

  if (factor < safetyFactor) {
    safetyFactor = factor;

    const map = structuredClone(emptyMap);

    for (const { x, y } of p) {
      map[y][x] = "#";
    }

    console.log(
      `======================================================================================================`,
    );
    console.log(map.map((row) => row.join("")).join("\n"));
    console.log(
      `======================================================================================================`,
    );
    console.log(
      `=== iteration #${i}                                                                                ===`,
    );
    console.log(
      `======================================================================================================`,
    );
    console.log();

    const answer = await rl.question("Continue? [Y/n]");
    if (answer.toLowerCase() === "n") {
      console.log(`Stopped at iteration #${i}`);
      process.exit(0);
    }
  }
}

let i = 1;
while (true) {
  await draw(i);
  i++;
}
