import { load } from "lib/load";

function alphabeticalSort(a: string, b: string) {
  return a.localeCompare(b);
}

const data = await load({ separator: /-/ });

const graph: Record<string, Set<string>> = {};

for (const [a, b] of data) {
  if (!(a in graph)) {
    graph[a] = new Set<string>();
  }

  if (!(b in graph)) {
    graph[b] = new Set<string>();
  }

  graph[a].add(b);
  graph[b].add(a);
}

const lans = new Set<string>();
const visited = new Set<string>();
for (const [computer, connections] of Object.entries(graph)) {
  for (const connection of connections) {
    if (visited.has(connection)) continue;
    const lan = lans
      .values()
      .toArray()
      .find((lan) => {
        return lan.split(",").every((member) => graph[member].has(connection));
      });

    if (lan) {
      lans.delete(lan);
      lans.add(
        [...lan.split(","), connection].sort(alphabeticalSort).join(","),
      );
    } else {
      lans.add([computer, connection].sort(alphabeticalSort).join(","));
    }
  }
  visited.add(computer);
}

let largest = "";
for (const lan of lans) {
  if (lan.length < largest.length) continue;
  largest = lan;
}

console.log(largest);
