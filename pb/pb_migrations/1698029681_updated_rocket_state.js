/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ecigl74242kmi99")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zrcuxp80",
    "name": "parent",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "dczff3le9ynu6fl",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xe4mvvth",
    "name": "state",
    "type": "select",
    "required": true,
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

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zrcuxp80",
    "name": "parent",
    "type": "relation",
    "required": true,
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

  // update
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
})
