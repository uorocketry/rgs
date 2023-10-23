/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dczff3le9ynu6fl")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "yzyrpzwr",
    "name": "discriminator",
    "type": "select",
    "required": true,
    "presentable": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "rocket_state",
        "rocket_sensor",
        "rocket_log",
        "rocket_command"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dczff3le9ynu6fl")

  // remove
  collection.schema.removeField("yzyrpzwr")

  return dao.saveCollection(collection)
})
