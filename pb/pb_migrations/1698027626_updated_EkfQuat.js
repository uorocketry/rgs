/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x88qi9uwtsb6nbj")

  collection.name = "rocket_quat"

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "n4idpsua",
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
  const collection = dao.findCollectionByNameOrId("x88qi9uwtsb6nbj")

  collection.name = "EkfQuat"

  // remove
  collection.schema.removeField("n4idpsua")

  return dao.saveCollection(collection)
})
