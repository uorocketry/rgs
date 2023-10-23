/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cj4yfkrqsd6ryti")

  collection.name = "rocket_nav2"

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xozfeuot",
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
  const collection = dao.findCollectionByNameOrId("cj4yfkrqsd6ryti")

  collection.name = "EkfNav2"

  // remove
  collection.schema.removeField("xozfeuot")

  return dao.saveCollection(collection)
})
