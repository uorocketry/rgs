migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zia29lesiizzyzu")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qw21eydk",
    "name": "distance_from_target",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "h3jxdinu",
    "name": "total_traveled_distance",
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
  collection.schema.removeField("qw21eydk")

  // remove
  collection.schema.removeField("h3jxdinu")

  return dao.saveCollection(collection)
})
