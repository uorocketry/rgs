migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hn03eiqnqs023qz")

  // remove
  collection.schema.removeField("kqaaed39")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hn03eiqnqs023qz")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kqaaed39",
    "name": "launchPoint",
    "type": "json",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
})
