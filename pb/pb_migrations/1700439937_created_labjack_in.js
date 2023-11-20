/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "2iupgrlfsq6w063",
    "created": "2023-11-20 00:25:37.396Z",
    "updated": "2023-11-20 00:25:37.396Z",
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
  const collection = dao.findCollectionByNameOrId("2iupgrlfsq6w063");

  return dao.deleteCollection(collection);
})
