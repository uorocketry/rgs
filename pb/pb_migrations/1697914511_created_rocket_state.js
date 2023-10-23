/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "ecigl74242kmi99",
    "created": "2023-10-21 18:55:11.698Z",
    "updated": "2023-10-21 18:55:11.698Z",
    "name": "rocket_state",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "lte9jmpt",
        "name": "data",
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
        "id": "zrcuxp80",
        "name": "parent",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "dczff3le9ynu6fl",
          "cascadeDelete": false,
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
  const collection = dao.findCollectionByNameOrId("ecigl74242kmi99");

  return dao.deleteCollection(collection);
})
