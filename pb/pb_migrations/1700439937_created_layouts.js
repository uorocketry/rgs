/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "oxua7d8py8vnolg",
    "created": "2023-11-20 00:25:37.394Z",
    "updated": "2023-11-20 00:25:37.394Z",
    "name": "layouts",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fkvxnwsd",
        "name": "name",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "bw8qymxm",
        "name": "data",
        "type": "json",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {}
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("oxua7d8py8vnolg");

  return dao.deleteCollection(collection);
})
