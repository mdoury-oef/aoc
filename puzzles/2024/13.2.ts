import { load } from "lib/load";

type ButtonConfig = {
  dx: number;
  dy: number;
};

type PrizeConfig = {
  x: number;
  y: number;
};

type GameConfig = {
  A: ButtonConfig;
  B: ButtonConfig;
  P: PrizeConfig;
};

const data = await load({
  lineSeparator: /\n\n/,
  separator: /\n/,
  parse(value) {
    if (value.startsWith("Button")) {
      const [_, button, x, y] = value.split(" ");
      return {
        type: "button",
        button: button.slice(0, -1) === "A" ? "A" : "B",
        dx: Number(x.split("+")[1].slice(0, -1)),
        dy: Number(y.split("+")[1]),
      } as const;
    }
    const [_, x, y] = value.split(" ");
    return {
      type: "prize",
      x: Number(x.split("=")[1].slice(0, -1)),
      y: Number(y.split("=")[1]),
    } as const;
  },
});

const games = data.map((game) =>
  game.reduce<GameConfig>(
    (config, option) => {
      switch (option.type) {
        case "button": {
          config[option.button] = {
            dx: option.dx,
            dy: option.dy,
          };
          break;
        }
        case "prize":
          {
            config.P = {
              x: option.x + 10000000000000,
              y: option.y + 10000000000000,
            };
          }
          break;
      }
      return config;
    },
    <GameConfig>{},
  ),
);

let total = 0;

for (const { A, B, P } of games) {
  const d = A.dx * B.dy - A.dy * B.dx;
  const a = (P.x * B.dy - P.y * B.dx) / d;
  const b = (P.y * A.dx - P.x * A.dy) / d;

  if (a % 1 || b % 1) continue;
  total += 3 * a + b;
}

console.log(total);
