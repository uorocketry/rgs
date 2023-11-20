/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "t9hmlozmotypjec",
    "created": "2023-11-20 00:25:37.394Z",
    "updated": "2023-11-20 00:25:37.394Z",
    "name": "rocket_sensor",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "vvi8b1it",
        "name": "component_id",
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
        "id": "rvm2znuo",
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
        "id": "xp8wr5at",
        "name": "discriminator",
        "type": "select",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "rocket_time",
            "rocket_air",
            "rocket_quat",
            "rocket_nav1",
            "rocket_nav2",
            "rocket_imu1",
            "rocket_imu2",
            "rocket_vel",
            "rocket_pos1",
            "rocket_pos2",
            "rocket_current",
            "rocket_voltage",
            "rocket_regulator",
            "rocket_temperature"
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
  const collection = dao.findCollectionByNameOrId("t9hmlozmotypjec");

  return dao.deleteCollection(collection);
})
