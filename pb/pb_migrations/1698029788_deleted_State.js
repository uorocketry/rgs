/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("i0x7lxnrgzhkrqn");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "i0x7lxnrgzhkrqn",
    "created": "2023-07-28 09:31:17.987Z",
    "updated": "2023-10-22 08:47:25.876Z",
    "name": "State",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fhst0l6x",
        "name": "status",
        "type": "select",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "Initializing",
            "WaitForTakeoff",
            "Ascent",
            "Descent",
            "TerminalDescent",
            "Abort",
            "WaitForRecovery"
          ]
        }
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
