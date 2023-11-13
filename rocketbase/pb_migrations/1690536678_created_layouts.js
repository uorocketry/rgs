migrate((db) => {
  const collection = new Collection({
    "id": "oxua7d8py8vnolg",
    "created": "2023-07-28 09:31:17.988Z",
    "updated": "2023-07-28 09:31:17.988Z",
    "name": "layouts",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fkvxnwsd",
        "name": "name",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "bw8qymxm",
        "name": "data",
        "type": "json",
        "required": true,
        "unique": false,
        "options": {}
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
  const collection = dao.findCollectionByNameOrId("oxua7d8py8vnolg");

  return dao.deleteCollection(collection);
})
