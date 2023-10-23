/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("v8wg9wk1opsoxgq")

  collection.name = "rocket_pos2"

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0zclplvx",
    "name": "parent",
    "type": "relation",
    "required": true,
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
  const collection = dao.findCollectionByNameOrId("v8wg9wk1opsoxgq")

  collection.name = "GpsPos2"

  // remove
  collection.schema.removeField("0zclplvx")

  return dao.saveCollection(collection)
})
