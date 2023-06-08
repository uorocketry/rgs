migrate((db) => {
  const collection = new Collection({
    "id": "i0x7lxnrgzhkrqn",
    "created": "2023-05-27 06:47:14.354Z",
    "updated": "2023-05-27 06:47:14.354Z",
    "name": "state",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fhst0l6x",
        "name": "status",
        "type": "select",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "Uninitialized",
            "Initializing",
            "Running"
          ]
        }
      },
      {
        "system": false,
        "id": "pxcg5yfl",
        "name": "has_error",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "n0nq8aml",
        "name": "voltage",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
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
  const collection = dao.findCollectionByNameOrId("i0x7lxnrgzhkrqn");

  return dao.deleteCollection(collection);
})
