migrate((db) => {
  const collection = new Collection({
    "id": "x88qi9uwtsb6nbj",
    "created": "2023-07-28 09:31:17.989Z",
    "updated": "2023-07-28 09:31:17.989Z",
    "name": "EkfQuat",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "tjtgzegc",
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
        "id": "lwuic6d9",
        "name": "quaternion_0",
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
        "id": "aqflkf6u",
        "name": "quaternion_1",
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
        "id": "qsoajx65",
        "name": "quaternion_2",
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
        "id": "5rsyji0v",
        "name": "quaternion_3",
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
        "id": "inzrkvbk",
        "name": "euler_std_dev_0",
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
        "id": "uzlx5yv6",
        "name": "euler_std_dev_1",
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
        "id": "bdzy64m4",
        "name": "euler_std_dev_2",
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
        "id": "e9rgewrm",
        "name": "status",
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
  const collection = dao.findCollectionByNameOrId("x88qi9uwtsb6nbj");

  return dao.deleteCollection(collection);
})
