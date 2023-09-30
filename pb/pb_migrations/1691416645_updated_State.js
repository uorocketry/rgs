migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("i0x7lxnrgzhkrqn")

  // remove
  collection.schema.removeField("n0nq8aml")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("i0x7lxnrgzhkrqn")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "n0nq8aml",
    "name": "voltage",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  return dao.saveCollection(collection)
})
