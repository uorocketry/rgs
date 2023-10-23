/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("t9hmlozmotypjec")

  // update
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
        "rocket_time",
        "rocket_air",
        "rocket_quat",
        "rocket_nav1",
        "rocket_nav2",
        "rocket_imu1",
        "rocket_imu2",
        "rocket_vel",
        "rocket_pos1",
        "rocket_pos2",
        "rocket_current",
        "rocket_voltage",
        "rocket_regulator",
        "rocket_temperature"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("t9hmlozmotypjec")

  // update
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
})
