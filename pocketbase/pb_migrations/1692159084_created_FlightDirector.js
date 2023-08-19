migrate((db) => {
  const collection = new Collection({
    "id": "hn03eiqnqs023qz",
    "created": "2023-08-16 04:11:24.212Z",
    "updated": "2023-08-16 04:11:24.212Z",
    "name": "FlightDirector",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "kqaaed39",
        "name": "launchPoint",
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
  const collection = dao.findCollectionByNameOrId("hn03eiqnqs023qz");

  return dao.deleteCollection(collection);
})
