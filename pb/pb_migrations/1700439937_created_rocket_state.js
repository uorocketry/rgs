/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "ecigl74242kmi99",
    "created": "2023-11-20 00:25:37.394Z",
    "updated": "2023-11-20 00:25:37.394Z",
    "name": "rocket_state",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "zrcuxp80",
        "name": "parent",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "dczff3le9ynu6fl",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "xe4mvvth",
        "name": "state",
        "type": "select",
        "required": true,
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
            "WaitForRecovery",
            "Abort"
          ]
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
  const collection = dao.findCollectionByNameOrId("ecigl74242kmi99");

  return dao.deleteCollection(collection);
})
