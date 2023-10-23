/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x88qi9uwtsb6nbj")

  // remove
  collection.schema.removeField("lwuic6d9")

  // remove
  collection.schema.removeField("aqflkf6u")

  // remove
  collection.schema.removeField("qsoajx65")

  // remove
  collection.schema.removeField("5rsyji0v")

  // remove
  collection.schema.removeField("inzrkvbk")

  // remove
  collection.schema.removeField("uzlx5yv6")

  // remove
  collection.schema.removeField("bdzy64m4")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hsyn8u8n",
    "name": "quaternion",
    "type": "json",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mcazbevh",
    "name": "euler_std_dev",
    "type": "json",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x88qi9uwtsb6nbj")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lwuic6d9",
    "name": "quaternion_0",
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
    "id": "aqflkf6u",
    "name": "quaternion_1",
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
    "id": "qsoajx65",
    "name": "quaternion_2",
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
    "id": "5rsyji0v",
    "name": "quaternion_3",
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
    "id": "inzrkvbk",
    "name": "euler_std_dev_0",
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
    "id": "uzlx5yv6",
    "name": "euler_std_dev_1",
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
    "id": "bdzy64m4",
    "name": "euler_std_dev_2",
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
  collection.schema.removeField("hsyn8u8n")

  // remove
  collection.schema.removeField("mcazbevh")

  return dao.saveCollection(collection)
})
