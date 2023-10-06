migrate((db) => {
  const collection = new Collection({
    "id": "zia29lesiizzyzu",
    "created": "2023-08-15 13:49:25.275Z",
    "updated": "2023-08-15 13:49:25.275Z",
    "name": "CalculatedMetrics",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "cogwwplp",
        "name": "max_altitude",
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
        "id": "u2e5hygj",
        "name": "max_true_air_speed",
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
        "id": "h8lcfwlr",
        "name": "g_force",
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
        "id": "ctqmbraj",
        "name": "max_g_force",
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
  const collection = dao.findCollectionByNameOrId("zia29lesiizzyzu");

  return dao.deleteCollection(collection);
})
