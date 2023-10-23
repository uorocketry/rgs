/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("elkbn6mwol6ws9l")

  // remove
  collection.schema.removeField("scx2dpmy")

  // remove
  collection.schema.removeField("saogbqqy")

  // remove
  collection.schema.removeField("pd6mygcf")

  // remove
  collection.schema.removeField("t4rc8tyi")

  // remove
  collection.schema.removeField("g6zsdc3d")

  // remove
  collection.schema.removeField("aja2zyqz")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wighplob",
    "name": "velocity",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vuz6z9sg",
    "name": "velocity_std_dev",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("elkbn6mwol6ws9l")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "scx2dpmy",
    "name": "velocity_0",
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
    "id": "saogbqqy",
    "name": "velocity_1",
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
    "id": "pd6mygcf",
    "name": "velocity_2",
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
    "id": "t4rc8tyi",
    "name": "velocity_std_dev_0",
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
    "id": "g6zsdc3d",
    "name": "velocity_std_dev_1",
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
    "id": "aja2zyqz",
    "name": "velocity_std_dev_2",
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
  collection.schema.removeField("wighplob")

  // remove
  collection.schema.removeField("vuz6z9sg")

  return dao.saveCollection(collection)
})
