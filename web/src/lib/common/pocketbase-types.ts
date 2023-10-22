/**
 * This file was @generated using pocketbase-typegen
 */

export enum Collections {
	Air = 'Air',
	CalculatedMetrics = 'CalculatedMetrics',
	EkfNav1 = 'EkfNav1',
	EkfNav2 = 'EkfNav2',
	EkfQuat = 'EkfQuat',
	FlightDirector = 'FlightDirector',
	GpsPos1 = 'GpsPos1',
	GpsPos2 = 'GpsPos2',
	GpsVel = 'GpsVel',
	Imu1 = 'Imu1',
	Imu2 = 'Imu2',
	Log = 'Log',
	State = 'State',
	Layouts = 'layouts',
	Raw = 'raw',
	RocketCommand = 'rocket_command',
	RocketLink = 'rocket_link',
	RocketLog = 'rocket_log',
	RocketMessage = 'rocket_message',
	RocketSensor = 'rocket_sensor',
	RocketState = 'rocket_state',
	RocketTime = 'rocket_time',
	Users = 'users'
}

// Alias types for improved usability
export type IsoDateString = string;
export type RecordIdString = string;
export type HTMLString = string;

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString;
	created: IsoDateString;
	updated: IsoDateString;
	collectionId: string;
	collectionName: Collections;
	expand?: T;
};

export type AuthSystemFields<T = never> = {
	email: string;
	emailVisibility: boolean;
	username: string;
	verified: boolean;
} & BaseSystemFields<T>;

// Record types for each collection

export type AirRecord = {
	air_temperature?: number;
	altitude?: number;
	pressure_abs?: number;
	pressure_diff?: number;
	status?: number;
	timestamp?: number;
	true_airspeed?: number;
};

export type CalculatedMetricsRecord = {
	distance_from_target?: number;
	g_force?: number;
	ground_altitude?: number;
	max_altitude?: number;
	max_g_force?: number;
	max_true_air_speed?: number;
	max_velocity_1?: number;
	max_velocity_2?: number;
	max_velocity_3?: number;
	total_traveled_distance?: number;
};

export type EkfNav1Record = {
	time_stamp?: number;
	velocity_0?: number;
	velocity_1?: number;
	velocity_2?: number;
	velocity_std_dev_0?: number;
	velocity_std_dev_1?: number;
	velocity_std_dev_2?: number;
};

export type EkfNav2Record = {
	position_0?: number;
	position_1?: number;
	position_2?: number;
	position_std_dev_0?: number;
	position_std_dev_1?: number;
	position_std_dev_2?: number;
	status?: number;
};

export type EkfQuatRecord = {
	euler_std_dev_0?: number;
	euler_std_dev_1?: number;
	euler_std_dev_2?: number;
	quaternion_0?: number;
	quaternion_1?: number;
	quaternion_2?: number;
	quaternion_3?: number;
	status?: number;
	time_stamp?: number;
};

export type FlightDirectorRecord = {
	latitude?: number;
	longitude?: number;
	relativeAltitude?: number;
	targetAltitude?: number;
};

export type GpsPos1Record = {
	altitude?: number;
	latitude?: number;
	longitude?: number;
	status?: number;
	timeOfWeek?: number;
	timestamp?: number;
	undulation?: number;
};

export type GpsPos2Record = {
	altitudeAccuracy?: number;
	baseStationId?: number;
	differentialAge?: number;
	latitudeAccuracy?: number;
	longitudeAccuracy?: number;
	numSvUsed?: number;
};

export type GpsVelRecord = {
	course?: number;
	course_acc?: number;
	status?: number;
	time_stamp?: number;
	velocity_0?: number;
	velocity_1?: number;
	velocity_2?: number;
	velocity_acc_0?: number;
	velocity_acc_1?: number;
	velocity_acc_2?: number;
};

export type Imu1Record = {
	accelerometers_0?: number;
	accelerometers_1?: number;
	accelerometers_2?: number;
	gyroscopes_0?: number;
	gyroscopes_1?: number;
	gyroscopes_2?: number;
	status?: number;
	time_stamp?: number;
};

export type Imu2Record = {
	delta_angle_0?: number;
	delta_angle_1?: number;
	delta_angle_2?: number;
	delta_velocity_0?: number;
	delta_velocity_1?: number;
	delta_velocity_2?: number;
	temperature?: number;
};

export type LogRecord<Tevent = unknown> = {
	event?: null | Tevent;
	level?: string;
};

export enum StateStatusOptions {
	'Initializing' = 'Initializing',
	'WaitForTakeoff' = 'WaitForTakeoff',
	'Ascent' = 'Ascent',
	'Descent' = 'Descent',
	'TerminalDescent' = 'TerminalDescent',
	'Abort' = 'Abort',
	'WaitForRecovery' = 'WaitForRecovery'
}
export type StateRecord = {
	status?: StateStatusOptions;
};

export type LayoutsRecord<Tdata = unknown> = {
	data: null | Tdata;
	name: string;
};

export type RawRecord<Tdata = unknown> = {
	data?: null | Tdata;
	timestamp?: number;
};

export type RocketCommandRecord<Tdata = unknown> = {
	data?: null | Tdata;
	parent?: RecordIdString;
};

export type RocketLinkRecord = {
	connected?: number;
	fixed?: number;
	missed_messages?: number;
	noise?: number;
	recent_error_rate?: number;
	remnoise?: number;
	remrssi?: number;
	rssi?: number;
	rxerrors?: number;
	timestamp?: number;
	txbuf?: number;
};

export type RocketLogRecord<Tevent = unknown> = {
	event?: null | Tevent;
	level?: string;
	parent?: RecordIdString;
};

export enum RocketMessageDiscriminatorOptions {
	'rocket_state' = 'rocket_state',
	'rocket_sensor' = 'rocket_sensor',
	'rocket_log' = 'rocket_log',
	'rocket_command' = 'rocket_command'
}

export enum RocketMessageSenderOptions {
	'GroundStation' = 'GroundStation',
	'SensorBoard' = 'SensorBoard',
	'RecoveryBoard' = 'RecoveryBoard',
	'CommunicationBoard' = 'CommunicationBoard',
	'PowerBoard' = 'PowerBoard',
	'CameraBoard' = 'CameraBoard'
}
export type RocketMessageRecord = {
	discriminator: RocketMessageDiscriminatorOptions;
	sender?: RocketMessageSenderOptions;
	timestamp?: number;
};

export enum RocketSensorDiscriminatorOptions {
	'rocket_time' = 'rocket_time',
	'rocket_air' = 'rocket_air',
	'rocket_quat' = 'rocket_quat',
	'rocket_nav1' = 'rocket_nav1',
	'rocket_nav2' = 'rocket_nav2',
	'rocket_imu1' = 'rocket_imu1',
	'rocket_imu2' = 'rocket_imu2',
	'rocket_vel' = 'rocket_vel',
	'rocket_pos1' = 'rocket_pos1',
	'rocket_pos2' = 'rocket_pos2',
	'rocket_current' = 'rocket_current',
	'rocket_voltage' = 'rocket_voltage',
	'rocket_regulator' = 'rocket_regulator',
	'rocket_temperature' = 'rocket_temperature'
}
export type RocketSensorRecord = {
	component_id?: number;
	discriminator?: RocketSensorDiscriminatorOptions;
	parent?: RecordIdString;
};

export enum RocketStateStateOptions {
	'Initializing' = 'Initializing',
	'WaitForTakeoff' = 'WaitForTakeoff',
	'Ascent' = 'Ascent',
	'Descent' = 'Descent',
	'TerminalDescent' = 'TerminalDescent',
	'WaitForRecovery' = 'WaitForRecovery',
	'Abort' = 'Abort'
}
export type RocketStateRecord = {
	parent?: RecordIdString;
	state?: RocketStateStateOptions;
};

export type RocketTimeRecord = {
	day?: number;
	gps_time_of_week?: number;
	hour?: number;
	minute?: number;
	month?: number;
	nano_second?: number;
	parent?: RecordIdString;
	second?: number;
	status?: number;
	time_stamp?: number;
	year?: number;
};

export type UsersRecord = {
	avatar?: string;
	name?: string;
};

// Response types include system fields and match responses from the PocketBase API
export type AirResponse<Texpand = unknown> = Required<AirRecord> & BaseSystemFields<Texpand>;
export type CalculatedMetricsResponse<Texpand = unknown> = Required<CalculatedMetricsRecord> &
	BaseSystemFields<Texpand>;
export type EkfNav1Response<Texpand = unknown> = Required<EkfNav1Record> &
	BaseSystemFields<Texpand>;
export type EkfNav2Response<Texpand = unknown> = Required<EkfNav2Record> &
	BaseSystemFields<Texpand>;
export type EkfQuatResponse<Texpand = unknown> = Required<EkfQuatRecord> &
	BaseSystemFields<Texpand>;
export type FlightDirectorResponse<Texpand = unknown> = Required<FlightDirectorRecord> &
	BaseSystemFields<Texpand>;
export type GpsPos1Response<Texpand = unknown> = Required<GpsPos1Record> &
	BaseSystemFields<Texpand>;
export type GpsPos2Response<Texpand = unknown> = Required<GpsPos2Record> &
	BaseSystemFields<Texpand>;
export type GpsVelResponse<Texpand = unknown> = Required<GpsVelRecord> & BaseSystemFields<Texpand>;
export type Imu1Response<Texpand = unknown> = Required<Imu1Record> & BaseSystemFields<Texpand>;
export type Imu2Response<Texpand = unknown> = Required<Imu2Record> & BaseSystemFields<Texpand>;
export type LogResponse<Tevent = unknown, Texpand = unknown> = Required<LogRecord<Tevent>> &
	BaseSystemFields<Texpand>;
export type StateResponse<Texpand = unknown> = Required<StateRecord> & BaseSystemFields<Texpand>;
export type LayoutsResponse<Tdata = unknown, Texpand = unknown> = Required<LayoutsRecord<Tdata>> &
	BaseSystemFields<Texpand>;
export type RawResponse<Tdata = unknown, Texpand = unknown> = Required<RawRecord<Tdata>> &
	BaseSystemFields<Texpand>;
export type RocketCommandResponse<Tdata = unknown, Texpand = unknown> = Required<
	RocketCommandRecord<Tdata>
> &
	BaseSystemFields<Texpand>;
export type RocketLinkResponse<Texpand = unknown> = Required<RocketLinkRecord> &
	BaseSystemFields<Texpand>;
export type RocketLogResponse<Tevent = unknown, Texpand = unknown> = Required<
	RocketLogRecord<Tevent>
> &
	BaseSystemFields<Texpand>;
export type RocketMessageResponse<Texpand = unknown> = Required<RocketMessageRecord> &
	BaseSystemFields<Texpand>;
export type RocketSensorResponse<Texpand = unknown> = Required<RocketSensorRecord> &
	BaseSystemFields<Texpand>;
export type RocketStateResponse<Texpand = unknown> = Required<RocketStateRecord> &
	BaseSystemFields<Texpand>;
export type RocketTimeResponse<Texpand = unknown> = Required<RocketTimeRecord> &
	BaseSystemFields<Texpand>;
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>;

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	Air: AirRecord;
	CalculatedMetrics: CalculatedMetricsRecord;
	EkfNav1: EkfNav1Record;
	EkfNav2: EkfNav2Record;
	EkfQuat: EkfQuatRecord;
	FlightDirector: FlightDirectorRecord;
	GpsPos1: GpsPos1Record;
	GpsPos2: GpsPos2Record;
	GpsVel: GpsVelRecord;
	Imu1: Imu1Record;
	Imu2: Imu2Record;
	Log: LogRecord;
	State: StateRecord;
	layouts: LayoutsRecord;
	raw: RawRecord;
	rocket_command: RocketCommandRecord;
	rocket_link: RocketLinkRecord;
	rocket_log: RocketLogRecord;
	rocket_message: RocketMessageRecord;
	rocket_sensor: RocketSensorRecord;
	rocket_state: RocketStateRecord;
	rocket_time: RocketTimeRecord;
	users: UsersRecord;
};

export type CollectionResponses = {
	Air: AirResponse;
	CalculatedMetrics: CalculatedMetricsResponse;
	EkfNav1: EkfNav1Response;
	EkfNav2: EkfNav2Response;
	EkfQuat: EkfQuatResponse;
	FlightDirector: FlightDirectorResponse;
	GpsPos1: GpsPos1Response;
	GpsPos2: GpsPos2Response;
	GpsVel: GpsVelResponse;
	Imu1: Imu1Response;
	Imu2: Imu2Response;
	Log: LogResponse;
	State: StateResponse;
	layouts: LayoutsResponse;
	raw: RawResponse;
	rocket_command: RocketCommandResponse;
	rocket_link: RocketLinkResponse;
	rocket_log: RocketLogResponse;
	rocket_message: RocketMessageResponse;
	rocket_sensor: RocketSensorResponse;
	rocket_state: RocketStateResponse;
	rocket_time: RocketTimeResponse;
	users: UsersResponse;
};
