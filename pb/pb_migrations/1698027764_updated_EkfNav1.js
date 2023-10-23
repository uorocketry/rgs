/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("elkbn6mwol6ws9l")

  collection.name = "rocket_nav1"

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "boavabp9",
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
  const collection = dao.findCollectionByNameOrId("elkbn6mwol6ws9l")

  collection.name = "EkfNav1"

  // remove
  collection.schema.removeField("boavabp9")

  return dao.saveCollection(collection)
})
