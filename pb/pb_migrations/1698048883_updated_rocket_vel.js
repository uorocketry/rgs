/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2x3hs336exfcjj3")

  // remove
  collection.schema.removeField("ttcvp9t1")

  // remove
  collection.schema.removeField("zlxlkgzk")

  // remove
  collection.schema.removeField("lq1gg9u9")

  // remove
  collection.schema.removeField("qgc5wiur")

  // remove
  collection.schema.removeField("n6rddczt")

  // remove
  collection.schema.removeField("9ajqoeqy")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nglhbg5j",
    "name": "velocity",
    "type": "json",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dcyhimha",
    "name": "velocity_acc",
    "type": "json",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2x3hs336exfcjj3")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ttcvp9t1",
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
    "id": "zlxlkgzk",
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
    "id": "lq1gg9u9",
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
    "id": "qgc5wiur",
    "name": "velocity_acc_0",
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
    "id": "n6rddczt",
    "name": "velocity_acc_1",
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
    "id": "9ajqoeqy",
    "name": "velocity_acc_2",
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
  collection.schema.removeField("nglhbg5j")

  // remove
  collection.schema.removeField("dcyhimha")

  return dao.saveCollection(collection)
})
