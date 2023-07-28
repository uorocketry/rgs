migrate((db) => {
  const collection = new Collection({
    "id": "3hycgu9t9vc6s5p",
    "created": "2023-07-28 05:39:36.922Z",
    "updated": "2023-07-28 05:39:36.922Z",
    "name": "rocket_log",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "0rlqixfx",
        "name": "level",
        "type": "text",
        "required": false,
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
  const collection = dao.findCollectionByNameOrId("3hycgu9t9vc6s5p");

  return dao.deleteCollection(collection);
})
