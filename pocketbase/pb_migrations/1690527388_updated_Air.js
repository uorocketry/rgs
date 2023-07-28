migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j5nqj2yxvfllzr")

  collection.listRule = ""
  collection.viewRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j5nqj2yxvfllzr")

  collection.listRule = null
  collection.viewRule = null

  return dao.saveCollection(collection)
})
