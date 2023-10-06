migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zia29lesiizzyzu")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vawmgdx4",
    "name": "max_velocity_1",
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
    "id": "3hut5hpw",
    "name": "max_velocity_2",
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
    "id": "wgfbtt3h",
    "name": "max_velocity_3",
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
  collection.schema.removeField("vawmgdx4")

  // remove
  collection.schema.removeField("3hut5hpw")

  // remove
  collection.schema.removeField("wgfbtt3h")

  return dao.saveCollection(collection)
})
