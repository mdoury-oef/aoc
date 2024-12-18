import { load } from "lib/load";

type Operand = 0n | 1n | 2n | 3n | 4n | 5n | 6n | 7n;

const [registerEntries, [instructions]] = (await load({
  lineSeparator: /\n\n/,
  separator: /\n/,
  parse(row) {
    if (row.startsWith("Register")) {
      const [_, register, value] = row.split(/:?\s/g);
      return [register, BigInt(value)] as const;
    }
    const [_, ...instructions] = row.split(/:\s|\,/g);
    return instructions.map(BigInt);
  },
})) as [Array<[string, bigint]>, [Array<Operand>]];

const Register = Object.fromEntries(registerEntries);
const InitialRegister = Object.fromEntries(registerEntries);

function combo(operand: Operand) {
  switch (operand) {
    case 0n:
    case 1n:
    case 2n:
    case 3n:
      return operand;
    case 4n:
      return Register.A;
    case 5n:
      return Register.B;
    case 6n:
      return Register.C;
    case 7n: {
      throw Error("Unknown combo operand: 7.");
    }
  }
}

function run(program: Operand[], A: bigint) {
  let pointer = 0;
  const out = new Array<bigint>();
  Register.A = A;
  Register.B = InitialRegister.B;
  Register.C = InitialRegister.C;

  while (pointer < program.length - 1) {
    const instruction = program[pointer];
    const operand = program[pointer + 1];

    let jump = false;

    switch (instruction) {
      case 0n: {
        // adv
        Register.A = Register.A >> combo(operand);
        break;
      }
      case 1n: {
        // bxl
        Register.B = Register.B ^ operand;
        break;
      }
      case 2n: {
        // bst
        Register.B = combo(operand) & 7n;
        break;
      }
      case 3n: {
        // jnz
        if (Register.A === 0n) break;
        pointer = Number(operand);
        jump = true;
        break;
      }
      case 4n: {
        // bxc
        Register.B = Register.B ^ Register.C;
        break;
      }
      case 5n: {
        // out
        out.push(combo(operand) & 7n);
        break;
      }
      case 6n: {
        // bdv
        Register.B = Register.A >> combo(operand);
        break;
      }
      case 7n: {
        // cdv
        Register.C = Register.A >> combo(operand);
        break;
      }
    }

    if (jump) continue;
    pointer += 2;
  }

  return out;
}

const reversed = instructions.toReversed();
const program = instructions.slice(0, -2);

function find(previousA: bigint, offset = 0): bigint | undefined {
  if (offset === reversed.length) {
    return previousA;
  }

  for (let i = 0n; i < 8n; i++) {
    const A = (previousA << 3n) + i;
    const output = run(program, A);
    if (output[0] === reversed[offset]) {
      const min = find(A, offset + 1);
      if (min) return min;
    }
  }
}

const min = find(0n);

console.log(min);
if (min) console.log(run(instructions, min).join(","));
