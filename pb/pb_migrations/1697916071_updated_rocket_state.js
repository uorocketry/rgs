/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ecigl74242kmi99")

  // remove
  collection.schema.removeField("jyykvp49")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xe4mvvth",
    "name": "state",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Initializing",
        "WaitForTakeoff",
        "Ascent",
        "Descent",
        "TerminalDescent",
        "WaitForRecovery",
        "Abort"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ecigl74242kmi99")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jyykvp49",
    "name": "data",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("xe4mvvth")

  return dao.saveCollection(collection)
})
