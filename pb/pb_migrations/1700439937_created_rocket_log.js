/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "4pki5vcwk0pmkyl",
    "created": "2023-11-20 00:25:37.395Z",
    "updated": "2023-11-20 00:25:37.395Z",
    "name": "rocket_log",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "j0t8qjmc",
        "name": "level",
        "type": "text",
        "required": false,
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
        "id": "c6u1pbh5",
        "name": "event",
        "type": "json",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "nk76e7lh",
        "name": "parent",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "dczff3le9ynu6fl",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
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
  const collection = dao.findCollectionByNameOrId("4pki5vcwk0pmkyl");

  return dao.deleteCollection(collection);
})
