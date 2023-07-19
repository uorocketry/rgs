migrate(
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('75b25svqlbrdkn9');

		collection.listRule = '';
		collection.viewRule = '';

		return dao.saveCollection(collection);
	},
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('75b25svqlbrdkn9');

		collection.listRule = null;
		collection.viewRule = null;

		return dao.saveCollection(collection);
	}
);
