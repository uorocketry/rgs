/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cj4yfkrqsd6ryti")

  // remove
  collection.schema.removeField("r6mf3d32")

  // remove
  collection.schema.removeField("slsljs7l")

  // remove
  collection.schema.removeField("hfckwoh3")

  // remove
  collection.schema.removeField("fbbar713")

  // remove
  collection.schema.removeField("zgx9cnkz")

  // remove
  collection.schema.removeField("0gfdmnvy")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "k6erpwmj",
    "name": "position",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jlwdovth",
    "name": "position_std_dev",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cj4yfkrqsd6ryti")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "r6mf3d32",
    "name": "position_0",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "slsljs7l",
    "name": "position_1",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hfckwoh3",
    "name": "position_2",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fbbar713",
    "name": "position_std_dev_0",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zgx9cnkz",
    "name": "position_std_dev_1",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0gfdmnvy",
    "name": "position_std_dev_2",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  // remove
  collection.schema.removeField("k6erpwmj")

  // remove
  collection.schema.removeField("jlwdovth")

  return dao.saveCollection(collection)
})
