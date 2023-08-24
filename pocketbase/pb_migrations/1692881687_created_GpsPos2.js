migrate((db) => {
  const collection = new Collection({
    "id": "v8wg9wk1opsoxgq",
    "created": "2023-08-24 12:54:47.451Z",
    "updated": "2023-08-24 12:54:47.451Z",
    "name": "GpsPos2",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "9irnudxu",
        "name": "latitudeAccuracy",
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
        "id": "exw0i721",
        "name": "longitudeAccuracy",
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
        "id": "lbcqc4wc",
        "name": "altitudeAccuracy",
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
        "id": "btoqk5uk",
        "name": "numSvUsed",
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
        "id": "nfrvcc5w",
        "name": "baseStationId",
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
        "id": "hvld1eyu",
        "name": "differentialAge",
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
  const collection = dao.findCollectionByNameOrId("v8wg9wk1opsoxgq");

  return dao.deleteCollection(collection);
})
