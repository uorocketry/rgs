migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("elkbn6mwol6ws9l")

  collection.listRule = ""
  collection.viewRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("elkbn6mwol6ws9l")

  collection.listRule = null
  collection.viewRule = null

  return dao.saveCollection(collection)
})
