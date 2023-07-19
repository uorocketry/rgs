migrate(
	(db) => {
		const collection = new Collection({
			id: '75b25svqlbrdkn9',
			created: '2023-05-27 06:49:04.899Z',
			updated: '2023-05-27 06:49:04.899Z',
			name: 'sbg',
			type: 'base',
			system: false,
			schema: [
				{
					system: false,
					id: '1ipzi7h1',
					name: 'accel_x',
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
					id: '1yqshjo2',
					name: 'accel_y',
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
					id: '3luiimw3',
					name: 'accel_z',
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
					id: 'dty2zjgk',
					name: 'velocity_n',
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
					id: '4wgzq15y',
					name: 'velocity_e',
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
					id: 'ew47k7oz',
					name: 'velocity_d',
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
					id: 'y01xtwrs',
					name: 'pressure',
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
					id: 'w5kxeasy',
					name: 'height',
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
					id: 'gop0pprx',
					name: 'roll',
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
					id: '8yqtnkhj',
					name: 'yaw',
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
					id: 'o23opkai',
					name: 'pitch',
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
					id: 'gwjrgiz9',
					name: 'latitude',
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
					id: 'yettwymx',
					name: 'longitude',
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
					id: 'wrjytt86',
					name: 'quant_w',
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
					id: 'y39ntk6y',
					name: 'quant_x',
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
					id: 'wj8mcyfw',
					name: 'quant_y',
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
					id: 'cqbqrxl9',
					name: 'quant_z',
					type: 'number',
					required: false,
					unique: false,
					options: {
						min: null,
						max: null
					}
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
		const collection = dao.findCollectionByNameOrId('75b25svqlbrdkn9');

		return dao.deleteCollection(collection);
	}
);
