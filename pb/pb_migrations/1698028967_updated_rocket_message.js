/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dczff3le9ynu6fl")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jsdjitlf",
    "name": "sender",
    "type": "select",
    "required": true,
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

  // update
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
})
