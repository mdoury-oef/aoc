import { load } from "lib/load";

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

const iterations = 100;

const positions = robots.map(([position, velocity]) => {
  let x = (position.x + iterations * velocity.x) % size.x;
  if (x < 0) {
    x += size.x;
  }

  let y = (position.y + iterations * velocity.y) % size.y;
  if (y < 0) {
    y += size.y;
  }
  return { x, y };
});

const safetyFactor =
  positions.filter((p) => p.x < middle.x && p.y < middle.y).length *
  positions.filter((p) => p.x > middle.x && p.y < middle.y).length *
  positions.filter((p) => p.x < middle.x && p.y > middle.y).length *
  positions.filter((p) => p.x > middle.x && p.y > middle.y).length;

console.log(`The total safety factor is ${safetyFactor}`);
