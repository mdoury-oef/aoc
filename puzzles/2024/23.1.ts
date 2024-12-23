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
  graph[a].add(b);

  if (!(b in graph)) {
    graph[b] = new Set<string>();
  }
  graph[b].add(a);
}

const trios = new Set<string>();

for (const [computer, connections] of Object.entries(graph)) {
  const connectionList = connections.values().toArray();
  for (const [i, c1] of connectionList.entries()) {
    for (const c2 of connectionList.slice(i)) {
      if (!graph[c1].has(c2) || !graph[c2].has(c1)) continue;
      trios.add([computer, c1, c2].sort(alphabeticalSort).join("-"));
    }
  }
}

const candidates = trios
  .values()
  .filter((trio) => trio.split("-").some((c) => c.startsWith("t")))
  .toArray();

console.log(candidates.length);
