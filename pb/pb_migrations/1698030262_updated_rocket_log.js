/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4pki5vcwk0pmkyl")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "c6u1pbh5",
    "name": "event",
    "type": "json",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4pki5vcwk0pmkyl")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "c6u1pbh5",
    "name": "event",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
})
