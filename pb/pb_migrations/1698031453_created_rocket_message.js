/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "dczff3le9ynu6fl",
    "created": "2023-10-23 03:24:13.888Z",
    "updated": "2023-10-23 03:24:13.888Z",
    "name": "rocket_message",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fmfahtfi",
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
        "id": "yzyrpzwr",
        "name": "discriminator",
        "type": "select",
        "required": true,
        "presentable": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "rocket_state",
            "rocket_sensor",
            "rocket_log",
            "rocket_command"
          ]
        }
      },
      {
        "system": false,
        "id": "jsdjitlf",
        "name": "sender",
        "type": "select",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "GroundStation",
            "SensorBoard",
            "RecoveryBoard",
            "CommunicationBoard",
            "PowerBoard",
            "CameraBoard"
          ]
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
  const collection = dao.findCollectionByNameOrId("dczff3le9ynu6fl");

  return dao.deleteCollection(collection);
})
