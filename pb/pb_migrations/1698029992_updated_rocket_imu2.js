/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x5iq701b4uba5gq")

  // remove
  collection.schema.removeField("fthl7sjj")

  // remove
  collection.schema.removeField("bslqj7r0")

  // remove
  collection.schema.removeField("tihbxxhu")

  // remove
  collection.schema.removeField("0xttqp3n")

  // remove
  collection.schema.removeField("zebwqm0m")

  // remove
  collection.schema.removeField("cfu7cyc5")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zvmofvar",
    "name": "delta_velocity",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dwkahisl",
    "name": "delta_angle",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x5iq701b4uba5gq")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fthl7sjj",
    "name": "delta_velocity_0",
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
    "id": "bslqj7r0",
    "name": "delta_velocity_1",
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
    "id": "tihbxxhu",
    "name": "delta_velocity_2",
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
    "id": "0xttqp3n",
    "name": "delta_angle_0",
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
    "id": "zebwqm0m",
    "name": "delta_angle_1",
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
    "id": "cfu7cyc5",
    "name": "delta_angle_2",
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
  collection.schema.removeField("zvmofvar")

  // remove
  collection.schema.removeField("dwkahisl")

  return dao.saveCollection(collection)
})
