/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4pki5vcwk0pmkyl")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nk76e7lh",
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
  const collection = dao.findCollectionByNameOrId("4pki5vcwk0pmkyl")

  // remove
  collection.schema.removeField("nk76e7lh")

  return dao.saveCollection(collection)
})
