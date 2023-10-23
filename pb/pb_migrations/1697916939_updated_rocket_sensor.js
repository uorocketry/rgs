/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("t9hmlozmotypjec")

  // remove
  collection.schema.removeField("csiajk8h")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rvm2znuo",
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
  const collection = dao.findCollectionByNameOrId("t9hmlozmotypjec")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "csiajk8h",
    "name": "parent",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "e9lc2jjf6543gr5",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // remove
  collection.schema.removeField("rvm2znuo")

  return dao.saveCollection(collection)
})
