/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("3hycgu9t9vc6s5p");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "3hycgu9t9vc6s5p",
    "created": "2023-07-28 09:31:17.988Z",
    "updated": "2023-07-28 09:31:17.988Z",
    "name": "Log",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "0rlqixfx",
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
        "id": "vslzjnqx",
        "name": "event",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
