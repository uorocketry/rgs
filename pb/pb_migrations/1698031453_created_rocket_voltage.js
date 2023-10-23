/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "pelo77y1by6i0ly",
    "created": "2023-10-23 03:24:13.888Z",
    "updated": "2023-10-23 03:24:13.888Z",
    "name": "rocket_voltage",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "3l1bzazi",
        "name": "voltage",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      },
      {
        "system": false,
        "id": "qxtqnqdf",
        "name": "rolling_avg",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      },
      {
        "system": false,
        "id": "itrmuzxl",
        "name": "parent",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "t9hmlozmotypjec",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("pelo77y1by6i0ly");

  return dao.deleteCollection(collection);
})
