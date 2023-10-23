/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5sg3q0j3a6ny2xf")

  collection.name = "rocket_link"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5sg3q0j3a6ny2xf")

  collection.name = "LinkStatus"

  return dao.saveCollection(collection)
})
