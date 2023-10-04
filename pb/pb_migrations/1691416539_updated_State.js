migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("i0x7lxnrgzhkrqn")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fhst0l6x",
    "name": "status",
    "type": "select",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Initializing",
        "WaitForTakeoff",
        "Ascent",
        "Apogee",
        "Landed",
        "Abort"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("i0x7lxnrgzhkrqn")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fhst0l6x",
    "name": "status",
    "type": "select",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Uninitialized",
        "Initializing",
        "Running"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
