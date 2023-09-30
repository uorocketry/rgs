migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hn03eiqnqs023qz")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "quxixduy",
    "name": "latitude",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zw0hm2sp",
    "name": "longitude",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hn03eiqnqs023qz")

  // remove
  collection.schema.removeField("quxixduy")

  // remove
  collection.schema.removeField("zw0hm2sp")

  return dao.saveCollection(collection)
})
