migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zia29lesiizzyzu")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "1z221vps",
    "name": "ground_altitude",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zia29lesiizzyzu")

  // remove
  collection.schema.removeField("1z221vps")

  return dao.saveCollection(collection)
})
