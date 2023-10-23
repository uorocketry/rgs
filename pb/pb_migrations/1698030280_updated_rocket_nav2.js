/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cj4yfkrqsd6ryti")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "k6erpwmj",
    "name": "position",
    "type": "json",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jlwdovth",
    "name": "position_std_dev",
    "type": "json",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cj4yfkrqsd6ryti")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "k6erpwmj",
    "name": "position",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jlwdovth",
    "name": "position_std_dev",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
})
