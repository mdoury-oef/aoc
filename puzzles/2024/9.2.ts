import { load } from "lib/load";

const input = await load({ parse: Number, separator: new RegExp("") });

type Range = { start: number; end: number };

const disks = input.reduce((disks, disk) => {
  disks.push(
    disk
      .reduce((disk, data, i) => {
        if (i % 2 === 0) {
          disk.push(...new Array(data).fill(i / 2));
        } else {
          disk.push(...new Array(data).fill("."));
        }
        return disk;
      }, new Array<string>())
      .join(","),
  );
  return disks;
}, new Array<string>());

function getDiskFiles(disk: string) {
  return [
    ...new Set(disk.split(",").filter((v) => !Number.isNaN(Number(v)))),
  ].sort((a, b) => (a > b ? -1 : 1));
}

function findRange(disk: string, value: string) {
  const start = disk.indexOf(value);
  if (start === -1) return null;
  return { start, end: start + value.length - 1 };
}

function swapRanges(disk: string, ranges: [Range, Range]) {
  const [firstRange, secondRange] =
    ranges[0].start < ranges[1].start
      ? [ranges[0], ranges[1]]
      : [ranges[1], ranges[0]];
  const first = disk.substring(firstRange.start, firstRange.end + 1);
  const second = disk.substring(secondRange.start, secondRange.end + 1);
  const start = disk.substring(0, firstRange.start - 1);
  const end = disk.substring(secondRange.end + 2);
  const middle = disk.substring(firstRange.end + 2, secondRange.start - 1);
  return [start, second, middle, first, end]
    .filter((segment) => segment.length)
    .join(",");
}

function getDiskChecksum(disk: string) {
  let checksum = 0;
  for (const [col, data] of disk.split(",").entries()) {
    if (data === ".") continue;
    checksum += col * Number(data);
  }
  return checksum;
}

let checksum = 0;
for (let disk of disks) {
  for (const file of getDiskFiles(disk)) {
    const count = disk.split(file).length - 1;
    const dataRange = findRange(disk, new Array(count).fill(file).join(","));
    if (!dataRange) continue;
    let emptyRange = findRange(disk, new Array(count).fill(".").join(","));
    if (!emptyRange) continue;
    if (emptyRange.start >= dataRange.start) continue;
    disk = swapRanges(disk, [emptyRange, dataRange]);
  }
  checksum += getDiskChecksum(disk);
}

console.log(`The checksum is ${checksum}`);
