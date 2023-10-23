/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dhuf6p5q665h2hb")

  // remove
  collection.schema.removeField("wru5xota")

  // remove
  collection.schema.removeField("dknmm0yt")

  // remove
  collection.schema.removeField("p4wgephp")

  // remove
  collection.schema.removeField("eqyjkbm4")

  // remove
  collection.schema.removeField("pywxxd1s")

  // remove
  collection.schema.removeField("g1pv19vg")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "eux1acxi",
    "name": "accelerometers",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "7knvwk2b",
    "name": "gyroscopes",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dhuf6p5q665h2hb")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wru5xota",
    "name": "accelerometers_0",
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
    "id": "dknmm0yt",
    "name": "accelerometers_1",
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
    "id": "p4wgephp",
    "name": "accelerometers_2",
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
    "id": "eqyjkbm4",
    "name": "gyroscopes_0",
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
    "id": "pywxxd1s",
    "name": "gyroscopes_1",
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
    "id": "g1pv19vg",
    "name": "gyroscopes_2",
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
  collection.schema.removeField("eux1acxi")

  // remove
  collection.schema.removeField("7knvwk2b")

  return dao.saveCollection(collection)
})
