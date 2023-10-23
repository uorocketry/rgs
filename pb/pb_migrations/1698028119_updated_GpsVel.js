/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2x3hs336exfcjj3")

  collection.name = "rocket_vel"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2x3hs336exfcjj3")

  collection.name = "GpsVel"

  return dao.saveCollection(collection)
})
