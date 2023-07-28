migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j5nqj2yxvfllzr")

  collection.name = "Air"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j5nqj2yxvfllzr")

  collection.name = "air"

  return dao.saveCollection(collection)
})
