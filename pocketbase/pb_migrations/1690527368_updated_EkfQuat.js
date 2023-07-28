migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x88qi9uwtsb6nbj")

  collection.listRule = ""
  collection.viewRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x88qi9uwtsb6nbj")

  collection.listRule = null
  collection.viewRule = null

  return dao.saveCollection(collection)
})
