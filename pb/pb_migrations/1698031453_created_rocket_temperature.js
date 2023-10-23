/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "7urgymw9cgh6gh3",
    "created": "2023-10-23 03:24:13.888Z",
    "updated": "2023-10-23 03:24:13.888Z",
    "name": "rocket_temperature",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "suvjiedc",
        "name": "temperature",
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
        "id": "z5lgpner",
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
        "id": "9ippdbhk",
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
  const collection = dao.findCollectionByNameOrId("7urgymw9cgh6gh3");

  return dao.deleteCollection(collection);
})
