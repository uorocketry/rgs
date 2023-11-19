/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "2iupgrlfsq6w063",
    "created": "2023-11-19 23:22:42.165Z",
    "updated": "2023-11-19 23:22:42.165Z",
    "name": "labjack_in",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fnhzkhkb",
        "name": "value",
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
        "id": "lkbkdy1t",
        "name": "peripheral",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
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
  const collection = dao.findCollectionByNameOrId("2iupgrlfsq6w063");

  return dao.deleteCollection(collection);
})
