/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x5iq701b4uba5gq")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zvmofvar",
    "name": "delta_velocity",
    "type": "json",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dwkahisl",
    "name": "delta_angle",
    "type": "json",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x5iq701b4uba5gq")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zvmofvar",
    "name": "delta_velocity",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dwkahisl",
    "name": "delta_angle",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
})
