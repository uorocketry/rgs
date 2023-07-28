migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4nf3p6xbmml2c83")

  collection.listRule = ""
  collection.viewRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4nf3p6xbmml2c83")

  collection.listRule = null
  collection.viewRule = null

  return dao.saveCollection(collection)
})
