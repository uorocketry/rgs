migrate(
	(db) => {
		const collection = new Collection({
			id: 'oxua7d8py8vnolg',
			created: '2023-06-10 06:54:10.546Z',
			updated: '2023-06-10 06:54:10.546Z',
			name: 'layouts',
			type: 'base',
			system: false,
			schema: [
				{
					system: false,
					id: 'fkvxnwsd',
					name: 'name',
					type: 'text',
					required: true,
					unique: false,
					options: {
						min: null,
						max: null,
						pattern: ''
					}
				},
				{
					system: false,
					id: 'bw8qymxm',
					name: 'data',
					type: 'json',
					required: true,
					unique: false,
					options: {}
				}
			],
			indexes: [],
			listRule: null,
			viewRule: null,
			createRule: null,
			updateRule: null,
			deleteRule: null,
			options: {}
		});

		return Dao(db).saveCollection(collection);
	},
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('oxua7d8py8vnolg');

		return dao.deleteCollection(collection);
	}
);
