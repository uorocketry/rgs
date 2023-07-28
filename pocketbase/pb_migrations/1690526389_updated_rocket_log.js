migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3hycgu9t9vc6s5p")

  collection.name = "Log"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3hycgu9t9vc6s5p")

  collection.name = "rocket_log"

  return dao.saveCollection(collection)
})
