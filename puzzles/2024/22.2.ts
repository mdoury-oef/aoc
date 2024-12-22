import { load } from "lib/load";

const data = await load({ parse: BigInt });
const secrets = data.flat();

function mix(secret: bigint, operand: bigint) {
  return secret ^ operand;
}

function prune(secret: bigint) {
  return secret % 16777216n;
}

function next(secret: bigint) {
  secret = prune(mix(secret, secret << 6n));
  secret = prune(mix(secret, secret >> 5n));
  secret = prune(mix(secret, secret << 11n));
  return secret;
}

let total: Record<string, bigint> = {};
const iterations = 2000;
for (let secret of secrets) {
  const dict: Record<string, bigint> = {};
  const changes = Array<bigint>();
  for (let i = 0; i < iterations; i++) {
    const n = next(secret);
    const price = n % 10n;
    if (changes.length < 4) {
      changes.push(price - (secret % 10n));
    } else {
      changes.shift();
      changes.push(price - (secret % 10n));
      const key = changes.join(",");
      if (!(key in dict)) {
        dict[key] = price;
      }
    }
    secret = n;
  }
  for (const [seq, price] of Object.entries(dict)) {
    if (!(seq in total)) {
      total[seq] = 0n;
    }
    total[seq] += price;
  }
}

const best = { seq: "", total: 0n };
for (const [seq, sum] of Object.entries(total)) {
  if (sum > best.total) {
    best.seq = seq;
    best.total = sum;
  }
}

console.log(best);
