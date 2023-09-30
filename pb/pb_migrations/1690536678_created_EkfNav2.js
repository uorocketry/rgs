migrate((db) => {
  const collection = new Collection({
    "id": "cj4yfkrqsd6ryti",
    "created": "2023-07-28 09:31:17.989Z",
    "updated": "2023-07-28 09:31:17.989Z",
    "name": "EkfNav2",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "r6mf3d32",
        "name": "position_0",
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
        "id": "slsljs7l",
        "name": "position_1",
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
        "id": "hfckwoh3",
        "name": "position_2",
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
        "id": "fbbar713",
        "name": "position_std_dev_0",
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
        "id": "zgx9cnkz",
        "name": "position_std_dev_1",
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
        "id": "0gfdmnvy",
        "name": "position_std_dev_2",
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
        "id": "q5lpfp2x",
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
  const collection = dao.findCollectionByNameOrId("cj4yfkrqsd6ryti");

  return dao.deleteCollection(collection);
})
