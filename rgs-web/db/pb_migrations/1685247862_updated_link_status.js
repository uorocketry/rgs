migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5sg3q0j3a6ny2xf")

  collection.listRule = ""
  collection.viewRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5sg3q0j3a6ny2xf")

  collection.listRule = null
  collection.viewRule = null

  return dao.saveCollection(collection)
})
