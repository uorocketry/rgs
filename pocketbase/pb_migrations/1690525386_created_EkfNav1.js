migrate((db) => {
  const collection = new Collection({
    "id": "elkbn6mwol6ws9l",
    "created": "2023-07-28 06:23:06.336Z",
    "updated": "2023-07-28 06:23:06.336Z",
    "name": "EkfNav1",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "b6nzcao4",
        "name": "time_stamp",
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
        "id": "scx2dpmy",
        "name": "velocity_0",
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
        "id": "saogbqqy",
        "name": "velocity_1",
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
        "id": "pd6mygcf",
        "name": "velocity_2",
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
        "id": "t4rc8tyi",
        "name": "velocity_std_dev_0",
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
        "id": "g6zsdc3d",
        "name": "velocity_std_dev_1",
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
        "id": "aja2zyqz",
        "name": "velocity_std_dev_2",
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
  const collection = dao.findCollectionByNameOrId("elkbn6mwol6ws9l");

  return dao.deleteCollection(collection);
})
