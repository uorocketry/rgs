/**
* This file was @generated using pocketbase-typegen
*/

export enum Collections {
	FlightDirector = "FlightDirector",
	Layouts = "layouts",
	RocketAir = "rocket_air",
	RocketCommand = "rocket_command",
	RocketCurrent = "rocket_current",
	RocketImu1 = "rocket_imu1",
	RocketImu2 = "rocket_imu2",
	RocketLink = "rocket_link",
	RocketLog = "rocket_log",
	RocketMessage = "rocket_message",
	RocketNav1 = "rocket_nav1",
	RocketNav2 = "rocket_nav2",
	RocketPos1 = "rocket_pos1",
	RocketPos2 = "rocket_pos2",
	RocketQuat = "rocket_quat",
	RocketRegulator = "rocket_regulator",
	RocketSensor = "rocket_sensor",
	RocketState = "rocket_state",
	RocketTemperature = "rocket_temperature",
	RocketTime = "rocket_time",
	RocketVel = "rocket_vel",
	RocketVoltage = "rocket_voltage",
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

export type FlightDirectorRecord = {
	latitude?: number
	longitude?: number
	relativeAltitude?: number
	targetAltitude?: number
}

export type LayoutsRecord<Tdata = unknown> = {
	data: null | Tdata
	name: string
}

export type RocketAirRecord = {
	air_temperature?: number
	altitude?: number
	parent: RecordIdString
	pressure_abs?: number
	pressure_diff?: number
	status?: number
	time_stamp?: number
	true_airspeed?: number
}

export type RocketCommandRecord<Tdata = unknown> = {
	data?: null | Tdata
	parent: RecordIdString
}

export type RocketCurrentRecord = {
	current?: number
	parent: RecordIdString
	rolling_avg?: number
}

export type RocketImu1Record<Taccelerometers = unknown, Tgyroscopes = unknown> = {
	accelerometers: null | Taccelerometers
	gyroscopes: null | Tgyroscopes
	parent: RecordIdString
	status?: number
	time_stamp?: number
}

export type RocketImu2Record<Tdelta_angle = unknown, Tdelta_velocity = unknown> = {
	delta_angle: null | Tdelta_angle
	delta_velocity: null | Tdelta_velocity
	parent: RecordIdString
	temperature?: number
}

export type RocketLinkRecord = {
	connected?: number
	fixed?: number
	missed_messages?: number
	noise?: number
	recent_error_rate?: number
	remnoise?: number
	remrssi?: number
	rssi?: number
	rxerrors?: number
	timestamp?: number
	txbuf?: number
}

export type RocketLogRecord<Tevent = unknown> = {
	event: null | Tevent
	level?: string
	parent: RecordIdString
}

export enum RocketMessageDiscriminatorOptions {
	"rocket_state" = "rocket_state",
	"rocket_sensor" = "rocket_sensor",
	"rocket_log" = "rocket_log",
	"rocket_command" = "rocket_command",
}

export enum RocketMessageSenderOptions {
	"GroundStation" = "GroundStation",
	"SensorBoard" = "SensorBoard",
	"RecoveryBoard" = "RecoveryBoard",
	"CommunicationBoard" = "CommunicationBoard",
	"PowerBoard" = "PowerBoard",
	"CameraBoard" = "CameraBoard",
}
export type RocketMessageRecord = {
	discriminator: RocketMessageDiscriminatorOptions
	sender: RocketMessageSenderOptions
	timestamp?: number
}

export type RocketNav1Record<Tvelocity = unknown, Tvelocity_std_dev = unknown> = {
	parent: RecordIdString
	time_stamp?: number
	velocity: null | Tvelocity
	velocity_std_dev: null | Tvelocity_std_dev
}

export type RocketNav2Record<Tposition = unknown, Tposition_std_dev = unknown> = {
	parent: RecordIdString
	position: null | Tposition
	position_std_dev: null | Tposition_std_dev
	status?: number
}

export type RocketPos1Record = {
	altitude?: number
	latitude?: number
	longitude?: number
	parent: RecordIdString
	status?: number
	timeOfWeek?: number
	timestamp?: number
	undulation?: number
}

export type RocketPos2Record = {
	altitudeAccuracy?: number
	baseStationId?: number
	differentialAge?: number
	latitudeAccuracy?: number
	longitudeAccuracy?: number
	numSvUsed?: number
	parent: RecordIdString
}

export type RocketQuatRecord<Teuler_std_dev = unknown, Tquaternion = unknown> = {
	euler_std_dev: null | Teuler_std_dev
	parent: RecordIdString
	quaternion: null | Tquaternion
	status?: number
	time_stamp?: number
}

export type RocketRegulatorRecord = {
	parent: RecordIdString
	status?: boolean
}

export enum RocketSensorDiscriminatorOptions {
	"rocket_time" = "rocket_time",
	"rocket_air" = "rocket_air",
	"rocket_quat" = "rocket_quat",
	"rocket_nav1" = "rocket_nav1",
	"rocket_nav2" = "rocket_nav2",
	"rocket_imu1" = "rocket_imu1",
	"rocket_imu2" = "rocket_imu2",
	"rocket_vel" = "rocket_vel",
	"rocket_pos1" = "rocket_pos1",
	"rocket_pos2" = "rocket_pos2",
	"rocket_current" = "rocket_current",
	"rocket_voltage" = "rocket_voltage",
	"rocket_regulator" = "rocket_regulator",
	"rocket_temperature" = "rocket_temperature",
}
export type RocketSensorRecord = {
	component_id?: number
	discriminator: RocketSensorDiscriminatorOptions
	parent: RecordIdString
}

export enum RocketStateStateOptions {
	"Initializing" = "Initializing",
	"WaitForTakeoff" = "WaitForTakeoff",
	"Ascent" = "Ascent",
	"Descent" = "Descent",
	"TerminalDescent" = "TerminalDescent",
	"WaitForRecovery" = "WaitForRecovery",
	"Abort" = "Abort",
}
export type RocketStateRecord = {
	parent: RecordIdString
	state: RocketStateStateOptions
}

export type RocketTemperatureRecord = {
	parent: RecordIdString
	rolling_avg?: number
	temperature?: number
}

export type RocketTimeRecord = {
	day?: number
	gps_time_of_week?: number
	hour?: number
	minute?: number
	month?: number
	nano_second?: number
	parent: RecordIdString
	second?: number
	status?: number
	time_stamp?: number
	year?: number
}

export type RocketVelRecord = {
	course?: number
	course_acc?: number
	parent: RecordIdString
	status?: number
	time_stamp?: number
	velocity_0?: number
	velocity_1?: number
	velocity_2?: number
	velocity_acc_0?: number
	velocity_acc_1?: number
	velocity_acc_2?: number
}

export type RocketVoltageRecord = {
	parent: RecordIdString
	rolling_avg?: number
	voltage?: number
}

export type UsersRecord = {
	avatar?: string
	name?: string
}

// Response types include system fields and match responses from the PocketBase API
export type FlightDirectorResponse<Texpand = unknown> = Required<FlightDirectorRecord> & BaseSystemFields<Texpand>
export type LayoutsResponse<Tdata = unknown, Texpand = unknown> = Required<LayoutsRecord<Tdata>> & BaseSystemFields<Texpand>
export type RocketAirResponse<Texpand = unknown> = Required<RocketAirRecord> & BaseSystemFields<Texpand>
export type RocketCommandResponse<Tdata = unknown, Texpand = unknown> = Required<RocketCommandRecord<Tdata>> & BaseSystemFields<Texpand>
export type RocketCurrentResponse<Texpand = unknown> = Required<RocketCurrentRecord> & BaseSystemFields<Texpand>
export type RocketImu1Response<Taccelerometers = unknown, Tgyroscopes = unknown, Texpand = unknown> = Required<RocketImu1Record<Taccelerometers, Tgyroscopes>> & BaseSystemFields<Texpand>
export type RocketImu2Response<Tdelta_angle = unknown, Tdelta_velocity = unknown, Texpand = unknown> = Required<RocketImu2Record<Tdelta_angle, Tdelta_velocity>> & BaseSystemFields<Texpand>
export type RocketLinkResponse<Texpand = unknown> = Required<RocketLinkRecord> & BaseSystemFields<Texpand>
export type RocketLogResponse<Tevent = unknown, Texpand = unknown> = Required<RocketLogRecord<Tevent>> & BaseSystemFields<Texpand>
export type RocketMessageResponse<Texpand = unknown> = Required<RocketMessageRecord> & BaseSystemFields<Texpand>
export type RocketNav1Response<Tvelocity = unknown, Tvelocity_std_dev = unknown, Texpand = unknown> = Required<RocketNav1Record<Tvelocity, Tvelocity_std_dev>> & BaseSystemFields<Texpand>
export type RocketNav2Response<Tposition = unknown, Tposition_std_dev = unknown, Texpand = unknown> = Required<RocketNav2Record<Tposition, Tposition_std_dev>> & BaseSystemFields<Texpand>
export type RocketPos1Response<Texpand = unknown> = Required<RocketPos1Record> & BaseSystemFields<Texpand>
export type RocketPos2Response<Texpand = unknown> = Required<RocketPos2Record> & BaseSystemFields<Texpand>
export type RocketQuatResponse<Teuler_std_dev = unknown, Tquaternion = unknown, Texpand = unknown> = Required<RocketQuatRecord<Teuler_std_dev, Tquaternion>> & BaseSystemFields<Texpand>
export type RocketRegulatorResponse<Texpand = unknown> = Required<RocketRegulatorRecord> & BaseSystemFields<Texpand>
export type RocketSensorResponse<Texpand = unknown> = Required<RocketSensorRecord> & BaseSystemFields<Texpand>
export type RocketStateResponse<Texpand = unknown> = Required<RocketStateRecord> & BaseSystemFields<Texpand>
export type RocketTemperatureResponse<Texpand = unknown> = Required<RocketTemperatureRecord> & BaseSystemFields<Texpand>
export type RocketTimeResponse<Texpand = unknown> = Required<RocketTimeRecord> & BaseSystemFields<Texpand>
export type RocketVelResponse<Texpand = unknown> = Required<RocketVelRecord> & BaseSystemFields<Texpand>
export type RocketVoltageResponse<Texpand = unknown> = Required<RocketVoltageRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	FlightDirector: FlightDirectorRecord
	layouts: LayoutsRecord
	rocket_air: RocketAirRecord
	rocket_command: RocketCommandRecord
	rocket_current: RocketCurrentRecord
	rocket_imu1: RocketImu1Record
	rocket_imu2: RocketImu2Record
	rocket_link: RocketLinkRecord
	rocket_log: RocketLogRecord
	rocket_message: RocketMessageRecord
	rocket_nav1: RocketNav1Record
	rocket_nav2: RocketNav2Record
	rocket_pos1: RocketPos1Record
	rocket_pos2: RocketPos2Record
	rocket_quat: RocketQuatRecord
	rocket_regulator: RocketRegulatorRecord
	rocket_sensor: RocketSensorRecord
	rocket_state: RocketStateRecord
	rocket_temperature: RocketTemperatureRecord
	rocket_time: RocketTimeRecord
	rocket_vel: RocketVelRecord
	rocket_voltage: RocketVoltageRecord
	users: UsersRecord
}

export type CollectionResponses = {
	FlightDirector: FlightDirectorResponse
	layouts: LayoutsResponse
	rocket_air: RocketAirResponse
	rocket_command: RocketCommandResponse
	rocket_current: RocketCurrentResponse
	rocket_imu1: RocketImu1Response
	rocket_imu2: RocketImu2Response
	rocket_link: RocketLinkResponse
	rocket_log: RocketLogResponse
	rocket_message: RocketMessageResponse
	rocket_nav1: RocketNav1Response
	rocket_nav2: RocketNav2Response
	rocket_pos1: RocketPos1Response
	rocket_pos2: RocketPos2Response
	rocket_quat: RocketQuatResponse
	rocket_regulator: RocketRegulatorResponse
	rocket_sensor: RocketSensorResponse
	rocket_state: RocketStateResponse
	rocket_temperature: RocketTemperatureResponse
	rocket_time: RocketTimeResponse
	rocket_vel: RocketVelResponse
	rocket_voltage: RocketVoltageResponse
	users: UsersResponse
}