/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "4pki5vcwk0pmkyl",
    "created": "2023-10-21 18:56:54.071Z",
    "updated": "2023-10-21 18:56:54.071Z",
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
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
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
  const collection = dao.findCollectionByNameOrId("4pki5vcwk0pmkyl");

  return dao.deleteCollection(collection);
})
