CREATE TABLE IF NOT EXISTS "data_quaternion" (
	"id" serial PRIMARY KEY NOT NULL,
	"w" real NOT NULL,
	"x" real NOT NULL,
	"y" real NOT NULL,
	"z" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "data_vec3" (
	"id" serial PRIMARY KEY NOT NULL,
	"x" real NOT NULL,
	"y" real NOT NULL,
	"z" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rocket_heartbeat" (
	"custom_mode" integer NOT NULL,
	"mavtype" integer NOT NULL,
	"autopilot" integer NOT NULL,
	"base_mode" integer NOT NULL,
	"system_status" integer NOT NULL,
	"mavlink_version" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rocket_message" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" integer NOT NULL,
	"sender" text NOT NULL,
	"type" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rocket_radio_status" (
	"rxerrors" integer NOT NULL,
	"fixed" integer NOT NULL,
	"rssi" integer NOT NULL,
	"remrssi" integer NOT NULL,
	"txbuf" integer NOT NULL,
	"noise" integer NOT NULL,
	"remnoise" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rocket_command" (
	"rocket_message_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rocket_deploy_drogue_command" (
	"rocket_command_id" integer NOT NULL,
	"val" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rocket_deploy_main_command" (
	"rocket_command_id" integer NOT NULL,
	"val" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rocket_power_down_command" (
	"rocket_command_id" integer NOT NULL,
	"sender" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rocket_radio_rate_change_command" (
	"rocket_command_id" integer NOT NULL,
	"rate" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rocket_log" (
	"rocket_message_id" integer NOT NULL,
	"level" text NOT NULL,
	"event" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rocket_sensor_air" (
	"rocket_sensor_message_id" integer NOT NULL,
	"time_stamp" integer NOT NULL,
	"status" integer NOT NULL,
	"pressure_abs" real NOT NULL,
	"altitude" real NOT NULL,
	"pressure_diff" real NOT NULL,
	"true_airspeed" real NOT NULL,
	"air_temperature" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rocket_sensor_current" (
	"rocket_sensor_message_id" integer NOT NULL,
	"current" real NOT NULL,
	"rolling_avg" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rocket_sensor_ekf_quat" (
	"rocket_sensor_message_id" integer NOT NULL,
	"time_stamp" integer NOT NULL,
	"quaternion" integer NOT NULL,
	"euler_std_dev" integer NOT NULL,
	"status" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rocket_sensor_ekv_nav_1" (
	"rocket_sensor_message_id" integer NOT NULL,
	"time_stamp" integer NOT NULL,
	"velocity" integer NOT NULL,
	"velocity_std_dev" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rocket_sensor_ekv_nav_2" (
	"rocket_sensor_message_id" integer NOT NULL,
	"time_stamp" integer NOT NULL,
	"position" integer NOT NULL,
	"position_std_dev" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rocket_sensor_gps_pos1" (
	"rocket_sensor_message_id" integer NOT NULL,
	"time_stamp" integer NOT NULL,
	"status" integer NOT NULL,
	"time_of_week" integer NOT NULL,
	"latitude" real NOT NULL,
	"longitude" real NOT NULL,
	"altitude" real NOT NULL,
	"undulation" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rocket_sensor_gps_pos2" (
	"rocket_sensor_message_id" integer NOT NULL,
	"latitude_accuracy" real NOT NULL,
	"longitude_accuracy" real NOT NULL,
	"altitude_accuracy" real NOT NULL,
	"num_sv_used" integer NOT NULL,
	"base_station_id" integer NOT NULL,
	"differential_age" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rocket_sensor_gps_vel" (
	"rocket_sensor_message_id" integer NOT NULL,
	"time_stamp" integer NOT NULL,
	"status" integer NOT NULL,
	"time_of_week" integer NOT NULL,
	"velocity" integer NOT NULL,
	"velocity_acc" integer NOT NULL,
	"course" real NOT NULL,
	"course_acc" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rocket_sensor_imu_1" (
	"rocket_sensor_message_id" integer NOT NULL,
	"time_stamp" integer NOT NULL,
	"status" integer NOT NULL,
	"accelerometers" integer NOT NULL,
	"gyroscopes" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rocket_sensor_imu_2" (
	"rocket_sensor_message_id" integer NOT NULL,
	"time_stamp" integer NOT NULL,
	"temperature" real NOT NULL,
	"delta_velocity" integer NOT NULL,
	"delta_angle" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rocket_sensor_message" (
	"id" serial PRIMARY KEY NOT NULL,
	"rocket_message_id" integer NOT NULL,
	"component_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rocket_sensor_regulator" (
	"rocket_sensor_message_id" integer NOT NULL,
	"status" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rocket_sensor_temperature" (
	"rocket_sensor_message_id" integer NOT NULL,
	"temperature" real NOT NULL,
	"rolling_avg" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rocket_sensor_utc_time" (
	"rocket_sensor_message_id" integer NOT NULL,
	"time_stamp" integer NOT NULL,
	"status" integer NOT NULL,
	"year" integer NOT NULL,
	"month" integer NOT NULL,
	"day" integer NOT NULL,
	"hour" integer NOT NULL,
	"minute" integer NOT NULL,
	"second" integer NOT NULL,
	"nano_second" integer NOT NULL,
	"gps_time_of_week" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rocket_sensor_voltage" (
	"rocket_sensor_message_id" integer NOT NULL,
	"voltage" real NOT NULL,
	"rolling_avg" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rocket_state" (
	"rocket_message_id" integer NOT NULL,
	"state" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_command" ADD CONSTRAINT "rocket_command_rocket_message_id_rocket_message_id_fk" FOREIGN KEY ("rocket_message_id") REFERENCES "rocket_message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_deploy_drogue_command" ADD CONSTRAINT "rocket_deploy_drogue_command_rocket_command_id_rocket_command_id_fk" FOREIGN KEY ("rocket_command_id") REFERENCES "rocket_command"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_deploy_main_command" ADD CONSTRAINT "rocket_deploy_main_command_rocket_command_id_rocket_command_id_fk" FOREIGN KEY ("rocket_command_id") REFERENCES "rocket_command"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_power_down_command" ADD CONSTRAINT "rocket_power_down_command_rocket_command_id_rocket_command_id_fk" FOREIGN KEY ("rocket_command_id") REFERENCES "rocket_command"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_radio_rate_change_command" ADD CONSTRAINT "rocket_radio_rate_change_command_rocket_command_id_rocket_command_id_fk" FOREIGN KEY ("rocket_command_id") REFERENCES "rocket_command"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_log" ADD CONSTRAINT "rocket_log_rocket_message_id_rocket_message_id_fk" FOREIGN KEY ("rocket_message_id") REFERENCES "rocket_message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_sensor_air" ADD CONSTRAINT "rocket_sensor_air_rocket_sensor_message_id_rocket_sensor_message_id_fk" FOREIGN KEY ("rocket_sensor_message_id") REFERENCES "rocket_sensor_message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_sensor_current" ADD CONSTRAINT "rocket_sensor_current_rocket_sensor_message_id_rocket_sensor_message_id_fk" FOREIGN KEY ("rocket_sensor_message_id") REFERENCES "rocket_sensor_message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_sensor_ekf_quat" ADD CONSTRAINT "rocket_sensor_ekf_quat_rocket_sensor_message_id_rocket_sensor_message_id_fk" FOREIGN KEY ("rocket_sensor_message_id") REFERENCES "rocket_sensor_message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_sensor_ekf_quat" ADD CONSTRAINT "rocket_sensor_ekf_quat_quaternion_data_quaternion_id_fk" FOREIGN KEY ("quaternion") REFERENCES "data_quaternion"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_sensor_ekf_quat" ADD CONSTRAINT "rocket_sensor_ekf_quat_euler_std_dev_data_vec3_id_fk" FOREIGN KEY ("euler_std_dev") REFERENCES "data_vec3"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_sensor_ekv_nav_1" ADD CONSTRAINT "rocket_sensor_ekv_nav_1_rocket_sensor_message_id_rocket_sensor_message_id_fk" FOREIGN KEY ("rocket_sensor_message_id") REFERENCES "rocket_sensor_message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_sensor_ekv_nav_1" ADD CONSTRAINT "rocket_sensor_ekv_nav_1_velocity_data_vec3_id_fk" FOREIGN KEY ("velocity") REFERENCES "data_vec3"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_sensor_ekv_nav_1" ADD CONSTRAINT "rocket_sensor_ekv_nav_1_velocity_std_dev_data_vec3_id_fk" FOREIGN KEY ("velocity_std_dev") REFERENCES "data_vec3"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_sensor_ekv_nav_2" ADD CONSTRAINT "rocket_sensor_ekv_nav_2_rocket_sensor_message_id_rocket_sensor_message_id_fk" FOREIGN KEY ("rocket_sensor_message_id") REFERENCES "rocket_sensor_message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_sensor_ekv_nav_2" ADD CONSTRAINT "rocket_sensor_ekv_nav_2_position_data_vec3_id_fk" FOREIGN KEY ("position") REFERENCES "data_vec3"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_sensor_ekv_nav_2" ADD CONSTRAINT "rocket_sensor_ekv_nav_2_position_std_dev_data_vec3_id_fk" FOREIGN KEY ("position_std_dev") REFERENCES "data_vec3"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_sensor_gps_pos1" ADD CONSTRAINT "rocket_sensor_gps_pos1_rocket_sensor_message_id_rocket_sensor_message_id_fk" FOREIGN KEY ("rocket_sensor_message_id") REFERENCES "rocket_sensor_message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_sensor_gps_pos2" ADD CONSTRAINT "rocket_sensor_gps_pos2_rocket_sensor_message_id_rocket_sensor_message_id_fk" FOREIGN KEY ("rocket_sensor_message_id") REFERENCES "rocket_sensor_message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_sensor_gps_vel" ADD CONSTRAINT "rocket_sensor_gps_vel_rocket_sensor_message_id_rocket_sensor_message_id_fk" FOREIGN KEY ("rocket_sensor_message_id") REFERENCES "rocket_sensor_message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_sensor_gps_vel" ADD CONSTRAINT "rocket_sensor_gps_vel_velocity_data_vec3_id_fk" FOREIGN KEY ("velocity") REFERENCES "data_vec3"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_sensor_gps_vel" ADD CONSTRAINT "rocket_sensor_gps_vel_velocity_acc_data_vec3_id_fk" FOREIGN KEY ("velocity_acc") REFERENCES "data_vec3"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_sensor_imu_1" ADD CONSTRAINT "rocket_sensor_imu_1_rocket_sensor_message_id_rocket_sensor_message_id_fk" FOREIGN KEY ("rocket_sensor_message_id") REFERENCES "rocket_sensor_message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_sensor_imu_1" ADD CONSTRAINT "rocket_sensor_imu_1_accelerometers_data_vec3_id_fk" FOREIGN KEY ("accelerometers") REFERENCES "data_vec3"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_sensor_imu_1" ADD CONSTRAINT "rocket_sensor_imu_1_gyroscopes_data_vec3_id_fk" FOREIGN KEY ("gyroscopes") REFERENCES "data_vec3"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_sensor_imu_2" ADD CONSTRAINT "rocket_sensor_imu_2_rocket_sensor_message_id_rocket_sensor_message_id_fk" FOREIGN KEY ("rocket_sensor_message_id") REFERENCES "rocket_sensor_message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_sensor_imu_2" ADD CONSTRAINT "rocket_sensor_imu_2_delta_velocity_data_vec3_id_fk" FOREIGN KEY ("delta_velocity") REFERENCES "data_vec3"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_sensor_imu_2" ADD CONSTRAINT "rocket_sensor_imu_2_delta_angle_data_vec3_id_fk" FOREIGN KEY ("delta_angle") REFERENCES "data_vec3"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_sensor_message" ADD CONSTRAINT "rocket_sensor_message_rocket_message_id_rocket_message_id_fk" FOREIGN KEY ("rocket_message_id") REFERENCES "rocket_message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_sensor_regulator" ADD CONSTRAINT "rocket_sensor_regulator_rocket_sensor_message_id_rocket_sensor_message_id_fk" FOREIGN KEY ("rocket_sensor_message_id") REFERENCES "rocket_sensor_message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_sensor_temperature" ADD CONSTRAINT "rocket_sensor_temperature_rocket_sensor_message_id_rocket_sensor_message_id_fk" FOREIGN KEY ("rocket_sensor_message_id") REFERENCES "rocket_sensor_message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_sensor_utc_time" ADD CONSTRAINT "rocket_sensor_utc_time_rocket_sensor_message_id_rocket_sensor_message_id_fk" FOREIGN KEY ("rocket_sensor_message_id") REFERENCES "rocket_sensor_message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_sensor_voltage" ADD CONSTRAINT "rocket_sensor_voltage_rocket_sensor_message_id_rocket_sensor_message_id_fk" FOREIGN KEY ("rocket_sensor_message_id") REFERENCES "rocket_sensor_message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rocket_state" ADD CONSTRAINT "rocket_state_rocket_message_id_rocket_message_id_fk" FOREIGN KEY ("rocket_message_id") REFERENCES "rocket_message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
