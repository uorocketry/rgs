/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ecigl74242kmi99")

  // remove
  collection.schema.removeField("lte9jmpt")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jyykvp49",
    "name": "data",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ecigl74242kmi99")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lte9jmpt",
    "name": "data",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // remove
  collection.schema.removeField("jyykvp49")

  return dao.saveCollection(collection)
})
