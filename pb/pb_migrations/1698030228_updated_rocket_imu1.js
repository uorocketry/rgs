/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dhuf6p5q665h2hb")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "eux1acxi",
    "name": "accelerometers",
    "type": "json",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "7knvwk2b",
    "name": "gyroscopes",
    "type": "json",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dhuf6p5q665h2hb")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "eux1acxi",
    "name": "accelerometers",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "7knvwk2b",
    "name": "gyroscopes",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
})
