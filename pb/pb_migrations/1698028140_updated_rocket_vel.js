/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2x3hs336exfcjj3")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "g0jrl68s",
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
  const collection = dao.findCollectionByNameOrId("2x3hs336exfcjj3")

  // remove
  collection.schema.removeField("g0jrl68s")

  return dao.saveCollection(collection)
})
