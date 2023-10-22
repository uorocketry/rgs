type TypeInfo = {
  type: string;
  required: boolean;
};

export class TypeBuilder {
  entries: Map<string, TypeInfo> = new Map();
  name: string = "";
  ands: string[] = [];

  constructor() {}

  addEntry(name: string, type: string, required: boolean = false) {
    this.entries.set(name, {
      type,
      required,
    });
    return this;
  }

  setName(name: string) {
    this.name = name;
    return this;
  }

  addAnd(and: string) {
    this.ands.push(and);
    return this;
  }

  toTypeScript() {
    const entries = Array.from(this.entries.entries())
      .map(([name, type]) => {
        return `\t${name}: ${type.type};`;
      })
      .join("\n");

    let ret = `export type ${this.name} = {\n`;
    ret += entries;
    ret += `\n}`;

    for (const and of this.ands) {
      ret += ` & ${and}`;
    }

    ret += ";\n";

    return ret;
  }
}
