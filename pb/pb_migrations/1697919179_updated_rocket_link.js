/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5sg3q0j3a6ny2xf")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "a0zkraxi",
    "name": "parent",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "dczff3le9ynu6fl",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5sg3q0j3a6ny2xf")

  // remove
  collection.schema.removeField("a0zkraxi")

  return dao.saveCollection(collection)
})
