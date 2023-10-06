migrate((db) => {
  const collection = new Collection({
    "id": "8j5nqj2yxvfllzr",
    "created": "2023-07-28 09:31:17.989Z",
    "updated": "2023-07-28 09:31:17.989Z",
    "name": "Air",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "9s0edfvw",
        "name": "timestamp",
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
        "id": "dkkzwm2g",
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
        "id": "oqhv8air",
        "name": "pressure_abs",
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
        "id": "jokv616m",
        "name": "altitude",
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
        "id": "v37is6en",
        "name": "pressure_diff",
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
        "id": "t1obxgpk",
        "name": "true_airspeed",
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
        "id": "kbtb1s2o",
        "name": "air_temperature",
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
  const collection = dao.findCollectionByNameOrId("8j5nqj2yxvfllzr");

  return dao.deleteCollection(collection);
})
