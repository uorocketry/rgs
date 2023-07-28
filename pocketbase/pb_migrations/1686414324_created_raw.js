migrate(
	(db) => {
		const collection = new Collection({
			id: '4nf3p6xbmml2c83',
			created: '2023-06-10 16:25:24.809Z',
			updated: '2023-06-10 16:25:24.809Z',
			name: 'raw',
			type: 'base',
			system: false,
			schema: [
				{
					system: false,
					id: 'ai2vkl0x',
					name: 'timestamp',
					type: 'number',
					required: false,
					unique: false,
					options: {
						min: null,
						max: null
					}
				},
				{
					system: false,
					id: 'z4fb30hj',
					name: 'data',
					type: 'json',
					required: false,
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
		const collection = dao.findCollectionByNameOrId('4nf3p6xbmml2c83');

		return dao.deleteCollection(collection);
	}
);
