/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "dczff3le9ynu6fl",
    "created": "2023-10-21 18:38:16.192Z",
    "updated": "2023-10-21 18:38:16.192Z",
    "name": "rocket_message",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fmfahtfi",
        "name": "timestamp",
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
        "id": "pjk03zvn",
        "name": "sender",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
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
  const collection = dao.findCollectionByNameOrId("dczff3le9ynu6fl");

  return dao.deleteCollection(collection);
})
