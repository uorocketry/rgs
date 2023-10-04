migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hn03eiqnqs023qz")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "b6qorqds",
    "name": "targetAltitude",
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
  collection.schema.removeField("b6qorqds")

  return dao.saveCollection(collection)
})
