migrate((db) => {
  const collection = new Collection({
    "id": "dhuf6p5q665h2hb",
    "created": "2023-07-28 09:31:17.988Z",
    "updated": "2023-07-28 09:31:17.988Z",
    "name": "Imu1",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fi169toc",
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
        "id": "6zbalzgl",
        "name": "status",
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
        "id": "wru5xota",
        "name": "accelerometers_0",
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
        "id": "dknmm0yt",
        "name": "accelerometers_1",
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
        "id": "p4wgephp",
        "name": "accelerometers_2",
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
        "id": "eqyjkbm4",
        "name": "gyroscopes_0",
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
        "id": "pywxxd1s",
        "name": "gyroscopes_1",
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
        "id": "g1pv19vg",
        "name": "gyroscopes_2",
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
  const collection = dao.findCollectionByNameOrId("dhuf6p5q665h2hb");

  return dao.deleteCollection(collection);
})
