/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("elkbn6mwol6ws9l")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wighplob",
    "name": "velocity",
    "type": "json",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vuz6z9sg",
    "name": "velocity_std_dev",
    "type": "json",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("elkbn6mwol6ws9l")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wighplob",
    "name": "velocity",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vuz6z9sg",
    "name": "velocity_std_dev",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
})
