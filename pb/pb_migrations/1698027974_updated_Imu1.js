/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dhuf6p5q665h2hb")

  collection.name = "rocket_imu1"

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cpwlxlv3",
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
  const collection = dao.findCollectionByNameOrId("dhuf6p5q665h2hb")

  collection.name = "Imu1"

  // remove
  collection.schema.removeField("cpwlxlv3")

  return dao.saveCollection(collection)
})
