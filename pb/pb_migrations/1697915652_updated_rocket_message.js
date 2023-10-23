/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dczff3le9ynu6fl")

  // remove
  collection.schema.removeField("pjk03zvn")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jsdjitlf",
    "name": "sender",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "GroundStation",
        "SensorBoard",
        "RecoveryBoard",
        "CommunicationBoard",
        "PowerBoard",
        "CameraBoard"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dczff3le9ynu6fl")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "pjk03zvn",
    "name": "sender",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // remove
  collection.schema.removeField("jsdjitlf")

  return dao.saveCollection(collection)
})
