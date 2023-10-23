/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j5nqj2yxvfllzr")

  collection.name = "rocket_air"

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "d5pfidrx",
    "name": "parent",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "t9hmlozmotypjec",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j5nqj2yxvfllzr")

  collection.name = "Air"

  // remove
  collection.schema.removeField("d5pfidrx")

  return dao.saveCollection(collection)
})
