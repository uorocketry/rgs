import { Database } from "bun:sqlite";
import { createCollectionType } from "./typescript-gen/collectionsTypeBuilder";
import { TypeBuilder } from "./typescript-gen/typeBuilder";

const db = new Database("./pb_data/data.db");

type RelationInfo = {
  type: "relation";
  options: {
    collectionId: string;
    cascadeDelete: boolean;
    minSelect: number | null;
    maxSelect: number;
    displayField: string | null;
  };
};

type JSONInfo = {
  type: "json";
  options: Record<string, never>;
};

type SelectInfo = {
  type: "select";
  options: {
    maxSelect: number;
    values: string[];
  };
};

type NumberInfo = {
  type: "number";
  options: {
    min: number | null;
    max: number | null;
    noDecimal: boolean;
  };
};

type TextInfo = {
  type: "text";
  options: {
    min: number | null;
    max: number | null;
    pattern: string;
  };
};

type SchemaInfo = {
  system: boolean;
  id: string;
  name: string;
  type: string;
  required: boolean;
  presentable: boolean;
  unique: boolean;
} & (SelectInfo | NumberInfo | TextInfo | JSONInfo | RelationInfo);

type CollectionInfo = {
  name: string;
  schema: SchemaInfo[];
  // Other fields are not important
};

function getCollectionsInfo(db: Database): CollectionInfo[] {
  const query = db.query("SELECT * FROM _collections WHERE type = 'base'");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const collections = query.all().map((row: any) => {
    row["schema"] = JSON.parse(row.schema as string);
    return row;
  }) as CollectionInfo[];
  return collections;
}

const collections = getCollectionsInfo(db);
console.log(createCollectionType(collections.map((c) => c.name)));

for (const collection of collections) {
  const typeBuilder = new TypeBuilder().setName(collection.name);
  for (const schema of collection.schema) {
    let type: string;
    switch (schema.type) {
      case "number":
        type = "number";
        break;
      case "text":
        type = "string";
        break;
      case "select": {
        type = schema.options.values.map((v) => `"${v}"`).join(" | ");
        if (schema.options.maxSelect != 1) {
          type = `(${type})[]`;
        }
        break;
      }
      case "json":
        type = "Map<string, unknown>";
        break;
      case "relation":
        type = "string";
        break;
      default:
        throw new Error(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore In case of new type
          `Unknown type: ${schema.type} for collection ${collection.name}`
        );
    }
    typeBuilder.addEntry(schema.name, type, schema.required);
  }
  console.log(typeBuilder.toTypeScript());
}

// export type BaseResponse = {
//   collectionId: string;
//   collectionName: string;
//   created: string;
//   id: string;
//   updated: string;
// };

// Create base response
console.log(
  new TypeBuilder()
    .setName("BaseResponse")
    .addEntry("collectionId", "string")
    .addEntry("collectionName", "string")
    .addEntry("created", "string")
    .addEntry("id", "string")
    .addEntry("updated", "string")
    .toTypeScript()
);

for (const collection of collections) {
  const template = `export type ${collection.name}BaseResponse = BaseResponse & ${collection.name};`;
  console.log(template);
}
