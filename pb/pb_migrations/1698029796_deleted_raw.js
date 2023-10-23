/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("4nf3p6xbmml2c83");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "4nf3p6xbmml2c83",
    "created": "2023-07-28 09:31:17.988Z",
    "updated": "2023-07-28 09:31:17.988Z",
    "name": "raw",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ai2vkl0x",
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
        "id": "z4fb30hj",
        "name": "data",
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
