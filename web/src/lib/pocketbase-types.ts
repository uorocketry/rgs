/* This file was @generated using pocketbase-typegen
*/
export enum Collections {
	Air = "Air",
	CalculatedMetrics = "CalculatedMetrics",
	EkfNav1 = "EkfNav1",
	EkfNav2 = "EkfNav2",
	EkfQuat = "EkfQuat",
	FlightDirector = "FlightDirector",
	GpsPos1 = "GpsPos1",
	GpsPos2 = "GpsPos2",
	GpsVel = "GpsVel",
	Imu1 = "Imu1",
	Imu2 = "Imu2",
	LinkStatus = "LinkStatus",
	Log = "Log",
	State = "State",
	Layouts = "layouts",
	Raw = "raw",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AirRecord = {
	air_temperature?: number
	altitude?: number
	pressure_abs?: number
	pressure_diff?: number
	status?: number
	timestamp?: number
	true_airspeed?: number
}

export type CalculatedMetricsRecord = {
	distance_from_target?: number
	g_force?: number
	ground_altitude?: number
	max_altitude?: number
	max_g_force?: number
	max_true_air_speed?: number
	max_velocity_1?: number
	max_velocity_2?: number
	max_velocity_3?: number
	total_traveled_distance?: number
}

export type EkfNav1Record = {
	time_stamp?: number
	velocity_0?: number
	velocity_1?: number
	velocity_2?: number
	velocity_std_dev_0?: number
	velocity_std_dev_1?: number
	velocity_std_dev_2?: number
}

export type EkfNav2Record = {
	position_0?: number
	position_1?: number
	position_2?: number
	position_std_dev_0?: number
	position_std_dev_1?: number
	position_std_dev_2?: number
	status?: number
}

export type EkfQuatRecord = {
	euler_std_dev_0?: number
	euler_std_dev_1?: number
	euler_std_dev_2?: number
	quaternion_0?: number
	quaternion_1?: number
	quaternion_2?: number
	quaternion_3?: number
	status?: number
	time_stamp?: number
}

export type FlightDirectorRecord = {
	latitude?: number
	longitude?: number
	relativeAltitude?: number
	targetAltitude?: number
}

export type GpsPos1Record = {
	altitude?: number
	latitude?: number
	longitude?: number
	status?: number
	timeOfWeek?: number
	timestamp?: number
	undulation?: number
}

export type GpsPos2Record = {
	altitudeAccuracy?: number
	baseStationId?: number
	differentialAge?: number
	latitudeAccuracy?: number
	longitudeAccuracy?: number
	numSvUsed?: number
}

export type GpsVelRecord = {
	course?: number
	course_acc?: number
	status?: number
	time_stamp?: number
	velocity_0?: number
	velocity_1?: number
	velocity_2?: number
	velocity_acc_0?: number
	velocity_acc_1?: number
	velocity_acc_2?: number
}

export type Imu1Record = {
	accelerometers_0?: number
	accelerometers_1?: number
	accelerometers_2?: number
	gyroscopes_0?: number
	gyroscopes_1?: number
	gyroscopes_2?: number
	status?: number
	time_stamp?: number
}

export type Imu2Record = {
	delta_angle_0?: number
	delta_angle_1?: number
	delta_angle_2?: number
	delta_velocity_0?: number
	delta_velocity_1?: number
	delta_velocity_2?: number
	temperature?: number
}

export type LinkStatusRecord = {
	connected?: number
	fixed?: number
	missed_messages?: number
	noise?: number
	recent_error_rate?: number
	remnoise?: number
	remrssi?: number
	rssi?: number
	rxerrors?: number
	txbuf?: number
}

export type LogRecord<Tevent = unknown> = {
	event?: null | Tevent
	level?: string
}

export enum StateStatusOptions {
	"Initializing" = "Initializing",
	"WaitForTakeoff" = "WaitForTakeoff",
	"Ascent" = "Ascent",
	"Descent" = "Descent",
	"TerminalDescent" = "TerminalDescent",
	"Abort" = "Abort",
	"WaitForRecovery" = "WaitForRecovery",
}
export type StateRecord = {
	status?: StateStatusOptions
}

export type LayoutsRecord<Tdata = unknown> = {
	data: null | Tdata
	name: string
}

export type RawRecord<Tdata = unknown> = {
	data?: null | Tdata
	timestamp?: number
}

export type UsersRecord = {
	avatar?: string
	name?: string
}

// Response types include system fields and match responses from the PocketBase API
export type AirResponse<Texpand = unknown> = Required<AirRecord> & BaseSystemFields<Texpand>
export type CalculatedMetricsResponse<Texpand = unknown> = Required<CalculatedMetricsRecord> & BaseSystemFields<Texpand>
export type EkfNav1Response<Texpand = unknown> = Required<EkfNav1Record> & BaseSystemFields<Texpand>
export type EkfNav2Response<Texpand = unknown> = Required<EkfNav2Record> & BaseSystemFields<Texpand>
export type EkfQuatResponse<Texpand = unknown> = Required<EkfQuatRecord> & BaseSystemFields<Texpand>
export type FlightDirectorResponse<Texpand = unknown> = Required<FlightDirectorRecord> & BaseSystemFields<Texpand>
export type GpsPos1Response<Texpand = unknown> = Required<GpsPos1Record> & BaseSystemFields<Texpand>
export type GpsPos2Response<Texpand = unknown> = Required<GpsPos2Record> & BaseSystemFields<Texpand>
export type GpsVelResponse<Texpand = unknown> = Required<GpsVelRecord> & BaseSystemFields<Texpand>
export type Imu1Response<Texpand = unknown> = Required<Imu1Record> & BaseSystemFields<Texpand>
export type Imu2Response<Texpand = unknown> = Required<Imu2Record> & BaseSystemFields<Texpand>
export type LinkStatusResponse<Texpand = unknown> = Required<LinkStatusRecord> & BaseSystemFields<Texpand>
export type LogResponse<Tevent = unknown, Texpand = unknown> = Required<LogRecord<Tevent>> & BaseSystemFields<Texpand>
export type StateResponse<Texpand = unknown> = Required<StateRecord> & BaseSystemFields<Texpand>
export type LayoutsResponse<Tdata = unknown, Texpand = unknown> = Required<LayoutsRecord<Tdata>> & BaseSystemFields<Texpand>
export type RawResponse<Tdata = unknown, Texpand = unknown> = Required<RawRecord<Tdata>> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	Air: AirRecord
	CalculatedMetrics: CalculatedMetricsRecord
	EkfNav1: EkfNav1Record
	EkfNav2: EkfNav2Record
	EkfQuat: EkfQuatRecord
	FlightDirector: FlightDirectorRecord
	GpsPos1: GpsPos1Record
	GpsPos2: GpsPos2Record
	GpsVel: GpsVelRecord
	Imu1: Imu1Record
	Imu2: Imu2Record
	LinkStatus: LinkStatusRecord
	Log: LogRecord
	State: StateRecord
	layouts: LayoutsRecord
	raw: RawRecord
	users: UsersRecord
}

export type CollectionResponses = {
	Air: AirResponse
	CalculatedMetrics: CalculatedMetricsResponse
	EkfNav1: EkfNav1Response
	EkfNav2: EkfNav2Response
	EkfQuat: EkfQuatResponse
	FlightDirector: FlightDirectorResponse
	GpsPos1: GpsPos1Response
	GpsPos2: GpsPos2Response
	GpsVel: GpsVelResponse
	Imu1: Imu1Response
	Imu2: Imu2Response
	LinkStatus: LinkStatusResponse
	Log: LogResponse
	State: StateResponse
	layouts: LayoutsResponse
	raw: RawResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

// export type TypedPocketBase = PocketBase & {
// 	collection(idOrName: 'Air'): RecordService<AirResponse>
// 	collection(idOrName: 'CalculatedMetrics'): RecordService<CalculatedMetricsResponse>
// 	collection(idOrName: 'EkfNav1'): RecordService<EkfNav1Response>
// 	collection(idOrName: 'EkfNav2'): RecordService<EkfNav2Response>
// 	collection(idOrName: 'EkfQuat'): RecordService<EkfQuatResponse>
// 	collection(idOrName: 'FlightDirector'): RecordService<FlightDirectorResponse>
// 	collection(idOrName: 'GpsPos1'): RecordService<GpsPos1Response>
// 	collection(idOrName: 'GpsPos2'): RecordService<GpsPos2Response>
// 	collection(idOrName: 'GpsVel'): RecordService<GpsVelResponse>
// 	collection(idOrName: 'Imu1'): RecordService<Imu1Response>
// 	collection(idOrName: 'Imu2'): RecordService<Imu2Response>
// 	collection(idOrName: 'LinkStatus'): RecordService<LinkStatusResponse>
// 	collection(idOrName: 'Log'): RecordService<LogResponse>
// 	collection(idOrName: 'State'): RecordService<StateResponse>
// 	collection(idOrName: 'layouts'): RecordService<LayoutsResponse>
// 	collection(idOrName: 'raw'): RecordService<RawResponse>
// 	collection(idOrName: 'users'): RecordService<UsersResponse>
// }
