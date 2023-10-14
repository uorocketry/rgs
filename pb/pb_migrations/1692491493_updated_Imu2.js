migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x5iq701b4uba5gq")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fdhwiexf",
    "name": "temperature",
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
  const collection = dao.findCollectionByNameOrId("x5iq701b4uba5gq")

  // remove
  collection.schema.removeField("fdhwiexf")

  return dao.saveCollection(collection)
})
