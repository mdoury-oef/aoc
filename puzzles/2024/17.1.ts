import { load } from "lib/load";

type Operand = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

const [registerEntries, [instructions]] = (await load({
  lineSeparator: /\n\n/,
  separator: /\n/,
  parse(row) {
    if (row.startsWith("Register")) {
      const [_, register, value] = row.split(/:?\s/g);
      return [register, Number(value)] as const;
    }
    const [_, ...instructions] = row.split(/:\s|\,/g);
    return instructions.map(Number);
  },
})) as [Array<[string, number]>, [Array<Operand>]];

const Register = Object.fromEntries(registerEntries);

function combo(operand: Operand) {
  switch (operand) {
    case 0:
    case 1:
    case 2:
    case 3:
      return operand;
    case 4:
      return Register.A;
    case 5:
      return Register.B;
    case 6:
      return Register.C;
    case 7: {
      throw Error("Unknown combo operand: 7.");
    }
  }
}

let pointer = 0;
const out = new Array<number>();

while (pointer < instructions.length - 1) {
  const instruction = instructions[pointer];
  const operand = instructions[pointer + 1];

  let jump = false;

  switch (instruction) {
    case 0: {
      // adv
      Register.A = Register.A >> combo(operand);
      break;
    }
    case 1: {
      // bxl
      Register.B = Register.B ^ operand;
      break;
    }
    case 2: {
      // bst
      Register.B = combo(operand) % 8;
      break;
    }
    case 3: {
      // jnz
      if (Register.A === 0) break;
      pointer = operand;
      jump = true;
      break;
    }
    case 4: {
      // bxc
      Register.B = Register.B ^ Register.C;
      break;
    }
    case 5: {
      // out
      out.push(combo(operand) % 8);
      break;
    }
    case 6: {
      // bdv
      Register.B = Register.A >> combo(operand);
      break;
    }
    case 7: {
      // cdv
      Register.C = Register.A >> combo(operand);
      break;
    }
  }

  if (jump) continue;
  pointer += 2;
}

console.log(out.join(","));
