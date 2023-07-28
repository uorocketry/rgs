migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3hycgu9t9vc6s5p")

  collection.listRule = ""
  collection.viewRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3hycgu9t9vc6s5p")

  collection.listRule = null
  collection.viewRule = null

  return dao.saveCollection(collection)
})
