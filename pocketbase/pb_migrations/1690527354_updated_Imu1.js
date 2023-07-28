migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dhuf6p5q665h2hb")

  collection.listRule = ""
  collection.viewRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dhuf6p5q665h2hb")

  collection.listRule = null
  collection.viewRule = null

  return dao.saveCollection(collection)
})
