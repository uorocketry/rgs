/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2iupgrlfsq6w063")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dlxkwmmx",
    "name": "timestamp",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2iupgrlfsq6w063")

  // remove
  collection.schema.removeField("dlxkwmmx")

  return dao.saveCollection(collection)
})
