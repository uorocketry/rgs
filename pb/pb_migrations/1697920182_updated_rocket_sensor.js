/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("t9hmlozmotypjec")

  // remove
  collection.schema.removeField("nyopyrik")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xp8wr5at",
    "name": "discriminator",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "UtcTime",
        "Air",
        "EkfQuat",
        "EkfNav1",
        "EkfNav2",
        "Imu1",
        "Imu2",
        "GpsVel",
        "GpsPos1",
        "GpsPos2",
        "Current",
        "Voltage",
        "Regulator",
        "Temperature"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("t9hmlozmotypjec")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nyopyrik",
    "name": "data",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("xp8wr5at")

  return dao.saveCollection(collection)
})
