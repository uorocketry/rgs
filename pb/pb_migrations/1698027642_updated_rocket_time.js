/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jpt172ey37qsk16")

  collection.name = "rocket_sensor_time"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jpt172ey37qsk16")

  collection.name = "rocket_time"

  return dao.saveCollection(collection)
})
