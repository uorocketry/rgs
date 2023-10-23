/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x5iq701b4uba5gq")

  collection.name = "rocket_imu2"

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ylz2v7dv",
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
  const collection = dao.findCollectionByNameOrId("x5iq701b4uba5gq")

  collection.name = "Imu2"

  // remove
  collection.schema.removeField("ylz2v7dv")

  return dao.saveCollection(collection)
})
