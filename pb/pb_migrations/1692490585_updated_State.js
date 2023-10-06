migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("i0x7lxnrgzhkrqn")

  // remove
  collection.schema.removeField("pxcg5yfl")

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
        "Descent",
        "TerminalDescent",
        "Abort"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("i0x7lxnrgzhkrqn")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "pxcg5yfl",
    "name": "has_error",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

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
})
