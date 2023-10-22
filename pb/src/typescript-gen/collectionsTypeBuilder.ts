export function createCollectionType(collections: string[]) {
  let ret = "";
  ret += "export const COLLECTIONS = [\n";
  ret += collections.map((c) => `\t'${c}'`).join(",\n");
  ret += "\n] as const;\n";
  ret += "\n";
  ret += "export type Collections = (typeof COLLECTIONS)[number];\n";

  return ret;
}
