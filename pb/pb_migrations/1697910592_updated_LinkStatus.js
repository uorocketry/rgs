/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5sg3q0j3a6ny2xf")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mkxfeesx",
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
  const collection = dao.findCollectionByNameOrId("5sg3q0j3a6ny2xf")

  // remove
  collection.schema.removeField("mkxfeesx")

  return dao.saveCollection(collection)
})
