migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("py9yara82me9gs0")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rn3ujuyz",
    "name": "altitude",
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
  const collection = dao.findCollectionByNameOrId("py9yara82me9gs0")

  // remove
  collection.schema.removeField("rn3ujuyz")

  return dao.saveCollection(collection)
})
