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

const iterations = 2000;
let res = 0n;
for (let secret of secrets) {
  for (let i = 0; i < iterations; i++) {
    secret = next(secret);
  }
  res += secret;
}

console.log(res);
