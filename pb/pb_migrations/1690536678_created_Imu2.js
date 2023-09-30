migrate((db) => {
  const collection = new Collection({
    "id": "x5iq701b4uba5gq",
    "created": "2023-07-28 09:31:17.988Z",
    "updated": "2023-07-28 09:31:17.988Z",
    "name": "Imu2",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fthl7sjj",
        "name": "delta_velocity_0",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      },
      {
        "system": false,
        "id": "bslqj7r0",
        "name": "delta_velocity_1",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      },
      {
        "system": false,
        "id": "tihbxxhu",
        "name": "delta_velocity_2",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      },
      {
        "system": false,
        "id": "0xttqp3n",
        "name": "delta_angle_0",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      },
      {
        "system": false,
        "id": "zebwqm0m",
        "name": "delta_angle_1",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      },
      {
        "system": false,
        "id": "cfu7cyc5",
        "name": "delta_angle_2",
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
    "listRule": "",
    "viewRule": "",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("x5iq701b4uba5gq");

  return dao.deleteCollection(collection);
})
