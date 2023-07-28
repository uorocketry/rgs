migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5sg3q0j3a6ny2xf")

  collection.name = "LinkStatus"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5sg3q0j3a6ny2xf")

  collection.name = "link_status"

  return dao.saveCollection(collection)
})
