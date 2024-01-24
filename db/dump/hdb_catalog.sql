--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: hdb_catalog; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA hdb_catalog;


ALTER SCHEMA hdb_catalog OWNER TO postgres;

--
-- Name: gen_hasura_uuid(); Type: FUNCTION; Schema: hdb_catalog; Owner: postgres
--

CREATE FUNCTION hdb_catalog.gen_hasura_uuid() RETURNS uuid
    LANGUAGE sql
    AS $$select gen_random_uuid()$$;


ALTER FUNCTION hdb_catalog.gen_hasura_uuid() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: hdb_action_log; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_action_log (
    id uuid DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    action_name text,
    input_payload jsonb NOT NULL,
    request_headers jsonb NOT NULL,
    session_variables jsonb NOT NULL,
    response_payload jsonb,
    errors jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    response_received_at timestamp with time zone,
    status text NOT NULL,
    CONSTRAINT hdb_action_log_status_check CHECK ((status = ANY (ARRAY['created'::text, 'processing'::text, 'completed'::text, 'error'::text])))
);


ALTER TABLE hdb_catalog.hdb_action_log OWNER TO postgres;

--
-- Name: hdb_cron_event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_cron_event_invocation_logs (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    event_id text,
    status integer,
    request json,
    response json,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE hdb_catalog.hdb_cron_event_invocation_logs OWNER TO postgres;

--
-- Name: hdb_cron_events; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_cron_events (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    trigger_name text NOT NULL,
    scheduled_time timestamp with time zone NOT NULL,
    status text DEFAULT 'scheduled'::text NOT NULL,
    tries integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    next_retry_at timestamp with time zone,
    CONSTRAINT valid_status CHECK ((status = ANY (ARRAY['scheduled'::text, 'locked'::text, 'delivered'::text, 'error'::text, 'dead'::text])))
);


ALTER TABLE hdb_catalog.hdb_cron_events OWNER TO postgres;

--
-- Name: hdb_metadata; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_metadata (
    id integer NOT NULL,
    metadata json NOT NULL,
    resource_version integer DEFAULT 1 NOT NULL
);


ALTER TABLE hdb_catalog.hdb_metadata OWNER TO postgres;

--
-- Name: hdb_scheduled_event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_scheduled_event_invocation_logs (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    event_id text,
    status integer,
    request json,
    response json,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE hdb_catalog.hdb_scheduled_event_invocation_logs OWNER TO postgres;

--
-- Name: hdb_scheduled_events; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_scheduled_events (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    webhook_conf json NOT NULL,
    scheduled_time timestamp with time zone NOT NULL,
    retry_conf json,
    payload json,
    header_conf json,
    status text DEFAULT 'scheduled'::text NOT NULL,
    tries integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    next_retry_at timestamp with time zone,
    comment text,
    CONSTRAINT valid_status CHECK ((status = ANY (ARRAY['scheduled'::text, 'locked'::text, 'delivered'::text, 'error'::text, 'dead'::text])))
);


ALTER TABLE hdb_catalog.hdb_scheduled_events OWNER TO postgres;

--
-- Name: hdb_schema_notifications; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_schema_notifications (
    id integer NOT NULL,
    notification json NOT NULL,
    resource_version integer DEFAULT 1 NOT NULL,
    instance_id uuid NOT NULL,
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT hdb_schema_notifications_id_check CHECK ((id = 1))
);


ALTER TABLE hdb_catalog.hdb_schema_notifications OWNER TO postgres;

--
-- Name: hdb_version; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_version (
    hasura_uuid uuid DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    version text NOT NULL,
    upgraded_on timestamp with time zone NOT NULL,
    cli_state jsonb DEFAULT '{}'::jsonb NOT NULL,
    console_state jsonb DEFAULT '{}'::jsonb NOT NULL,
    ee_client_id text,
    ee_client_secret text
);


ALTER TABLE hdb_catalog.hdb_version OWNER TO postgres;

--
-- Data for Name: hdb_action_log; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_action_log (id, action_name, input_payload, request_headers, session_variables, response_payload, errors, created_at, response_received_at, status) FROM stdin;
\.


--
-- Data for Name: hdb_cron_event_invocation_logs; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_cron_event_invocation_logs (id, event_id, status, request, response, created_at) FROM stdin;
\.


--
-- Data for Name: hdb_cron_events; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_cron_events (id, trigger_name, scheduled_time, status, tries, created_at, next_retry_at) FROM stdin;
\.


--
-- Data for Name: hdb_metadata; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_metadata (id, metadata, resource_version) FROM stdin;
1	{"sources":[{"configuration":{"connection_info":{"database_url":{"from_env":"HASURA_GRAPHQL_DATABASE_URL"},"isolation_level":"read-committed","pool_settings":{"connection_lifetime":600,"idle_timeout":180,"max_connections":50,"retries":1},"use_prepared_statements":true}},"kind":"postgres","name":"default","tables":[{"array_relationships":[{"name":"rocket_sensor_quats","using":{"foreign_key_constraint_on":{"column":"quaternion","table":{"name":"rocket_sensor_quat","schema":"public"}}}}],"table":{"name":"data_quaternion","schema":"public"}},{"array_relationships":[{"name":"rocketSensorGpsVelsByVelocity","using":{"foreign_key_constraint_on":{"column":"velocity","table":{"name":"rocket_sensor_gps_vel","schema":"public"}}}},{"name":"rocketSensorImu1sByGyroscopes","using":{"foreign_key_constraint_on":{"column":"gyroscopes","table":{"name":"rocket_sensor_imu_1","schema":"public"}}}},{"name":"rocketSensorImu2sByDeltaVelocity","using":{"foreign_key_constraint_on":{"column":"delta_velocity","table":{"name":"rocket_sensor_imu_2","schema":"public"}}}},{"name":"rocketSensorNav1sByVelocityStdDev","using":{"foreign_key_constraint_on":{"column":"velocity_std_dev","table":{"name":"rocket_sensor_nav_1","schema":"public"}}}},{"name":"rocketSensorNav2sByPositionStdDev","using":{"foreign_key_constraint_on":{"column":"position_std_dev","table":{"name":"rocket_sensor_nav_2","schema":"public"}}}},{"name":"rocket_sensor_gps_vels","using":{"foreign_key_constraint_on":{"column":"velocity_acc","table":{"name":"rocket_sensor_gps_vel","schema":"public"}}}},{"name":"rocket_sensor_imu_1s","using":{"foreign_key_constraint_on":{"column":"accelerometers","table":{"name":"rocket_sensor_imu_1","schema":"public"}}}},{"name":"rocket_sensor_imu_2s","using":{"foreign_key_constraint_on":{"column":"delta_angle","table":{"name":"rocket_sensor_imu_2","schema":"public"}}}},{"name":"rocket_sensor_nav_1s","using":{"foreign_key_constraint_on":{"column":"velocity","table":{"name":"rocket_sensor_nav_1","schema":"public"}}}},{"name":"rocket_sensor_nav_2s","using":{"foreign_key_constraint_on":{"column":"position","table":{"name":"rocket_sensor_nav_2","schema":"public"}}}},{"name":"rocket_sensor_quats","using":{"foreign_key_constraint_on":{"column":"euler_std_dev","table":{"name":"rocket_sensor_quat","schema":"public"}}}}],"table":{"name":"data_vec3","schema":"public"}},{"object_relationships":[{"name":"rocket_deploy_drogue_command","using":{"foreign_key_constraint_on":{"column":"rocket_command_id","table":{"name":"rocket_deploy_drogue_command","schema":"public"}}}},{"name":"rocket_deploy_main_command","using":{"foreign_key_constraint_on":{"column":"rocket_command_id","table":{"name":"rocket_deploy_main_command","schema":"public"}}}},{"name":"rocket_message","using":{"foreign_key_constraint_on":"rocket_message_id"}},{"name":"rocket_power_down_command","using":{"foreign_key_constraint_on":{"column":"rocket_command_id","table":{"name":"rocket_power_down_command","schema":"public"}}}},{"name":"rocket_radio_rate_change_command","using":{"foreign_key_constraint_on":{"column":"rocket_command_id","table":{"name":"rocket_radio_rate_change_command","schema":"public"}}}}],"table":{"name":"rocket_command","schema":"public"}},{"object_relationships":[{"name":"rocket_command","using":{"foreign_key_constraint_on":"rocket_command_id"}}],"table":{"name":"rocket_deploy_drogue_command","schema":"public"}},{"object_relationships":[{"name":"rocket_command","using":{"foreign_key_constraint_on":"rocket_command_id"}}],"table":{"name":"rocket_deploy_main_command","schema":"public"}},{"object_relationships":[{"name":"rocket_health_status","using":{"foreign_key_constraint_on":{"column":"rocket_health_id","table":{"name":"rocket_health_status","schema":"public"}}}},{"name":"rocket_message","using":{"foreign_key_constraint_on":"rocket_message_id"}}],"table":{"name":"rocket_health","schema":"public"}},{"object_relationships":[{"name":"rocket_health","using":{"foreign_key_constraint_on":"rocket_health_id"}}],"table":{"name":"rocket_health_status","schema":"public"}},{"table":{"name":"rocket_heartbeat","schema":"public"}},{"object_relationships":[{"name":"rocket_message","using":{"foreign_key_constraint_on":"rocket_message_id"}}],"table":{"name":"rocket_log","schema":"public"}},{"object_relationships":[{"name":"rocket_command","using":{"foreign_key_constraint_on":{"column":"rocket_message_id","table":{"name":"rocket_command","schema":"public"}}}},{"name":"rocket_health","using":{"foreign_key_constraint_on":{"column":"rocket_message_id","table":{"name":"rocket_health","schema":"public"}}}},{"name":"rocket_log","using":{"foreign_key_constraint_on":{"column":"rocket_message_id","table":{"name":"rocket_log","schema":"public"}}}},{"name":"rocket_sensor_message","using":{"foreign_key_constraint_on":{"column":"rocket_message_id","table":{"name":"rocket_sensor_message","schema":"public"}}}},{"name":"rocket_state","using":{"foreign_key_constraint_on":{"column":"rocket_message_id","table":{"name":"rocket_state","schema":"public"}}}}],"table":{"name":"rocket_message","schema":"public"}},{"object_relationships":[{"name":"rocket_command","using":{"foreign_key_constraint_on":"rocket_command_id"}}],"table":{"name":"rocket_power_down_command","schema":"public"}},{"object_relationships":[{"name":"rocket_command","using":{"foreign_key_constraint_on":"rocket_command_id"}}],"table":{"name":"rocket_radio_rate_change_command","schema":"public"}},{"table":{"name":"rocket_radio_status","schema":"public"}},{"object_relationships":[{"name":"rocket_sensor_message","using":{"foreign_key_constraint_on":"rocket_sensor_message_id"}}],"table":{"name":"rocket_sensor_air","schema":"public"}},{"object_relationships":[{"name":"rocket_sensor_message","using":{"foreign_key_constraint_on":"rocket_sensor_message_id"}}],"table":{"name":"rocket_sensor_gps_pos_1","schema":"public"}},{"object_relationships":[{"name":"rocket_sensor_message","using":{"foreign_key_constraint_on":"rocket_sensor_message_id"}}],"table":{"name":"rocket_sensor_gps_pos_2","schema":"public"}},{"object_relationships":[{"name":"dataVec3ByVelocity","using":{"foreign_key_constraint_on":"velocity"}},{"name":"data_vec3","using":{"foreign_key_constraint_on":"velocity_acc"}},{"name":"rocket_sensor_message","using":{"foreign_key_constraint_on":"rocket_sensor_message_id"}}],"table":{"name":"rocket_sensor_gps_vel","schema":"public"}},{"object_relationships":[{"name":"dataVec3ByGyroscopes","using":{"foreign_key_constraint_on":"gyroscopes"}},{"name":"data_vec3","using":{"foreign_key_constraint_on":"accelerometers"}},{"name":"rocket_sensor_message","using":{"foreign_key_constraint_on":"rocket_sensor_message_id"}}],"table":{"name":"rocket_sensor_imu_1","schema":"public"}},{"object_relationships":[{"name":"dataVec3ByDeltaVelocity","using":{"foreign_key_constraint_on":"delta_velocity"}},{"name":"data_vec3","using":{"foreign_key_constraint_on":"delta_angle"}},{"name":"rocket_sensor_message","using":{"foreign_key_constraint_on":"rocket_sensor_message_id"}}],"table":{"name":"rocket_sensor_imu_2","schema":"public"}},{"object_relationships":[{"name":"rocket_message","using":{"foreign_key_constraint_on":"rocket_message_id"}},{"name":"rocket_sensor_air","using":{"foreign_key_constraint_on":{"column":"rocket_sensor_message_id","table":{"name":"rocket_sensor_air","schema":"public"}}}},{"name":"rocket_sensor_gps_pos_1","using":{"foreign_key_constraint_on":{"column":"rocket_sensor_message_id","table":{"name":"rocket_sensor_gps_pos_1","schema":"public"}}}},{"name":"rocket_sensor_gps_pos_2","using":{"foreign_key_constraint_on":{"column":"rocket_sensor_message_id","table":{"name":"rocket_sensor_gps_pos_2","schema":"public"}}}},{"name":"rocket_sensor_gps_vel","using":{"foreign_key_constraint_on":{"column":"rocket_sensor_message_id","table":{"name":"rocket_sensor_gps_vel","schema":"public"}}}},{"name":"rocket_sensor_imu_1","using":{"foreign_key_constraint_on":{"column":"rocket_sensor_message_id","table":{"name":"rocket_sensor_imu_1","schema":"public"}}}},{"name":"rocket_sensor_imu_2","using":{"foreign_key_constraint_on":{"column":"rocket_sensor_message_id","table":{"name":"rocket_sensor_imu_2","schema":"public"}}}},{"name":"rocket_sensor_nav_1","using":{"foreign_key_constraint_on":{"column":"rocket_sensor_message_id","table":{"name":"rocket_sensor_nav_1","schema":"public"}}}},{"name":"rocket_sensor_nav_2","using":{"foreign_key_constraint_on":{"column":"rocket_sensor_message_id","table":{"name":"rocket_sensor_nav_2","schema":"public"}}}},{"name":"rocket_sensor_quat","using":{"foreign_key_constraint_on":{"column":"rocket_sensor_message_id","table":{"name":"rocket_sensor_quat","schema":"public"}}}},{"name":"rocket_sensor_utc_time","using":{"foreign_key_constraint_on":{"column":"rocket_sensor_message_id","table":{"name":"rocket_sensor_utc_time","schema":"public"}}}}],"table":{"name":"rocket_sensor_message","schema":"public"}},{"object_relationships":[{"name":"dataVec3ByVelocityStdDev","using":{"foreign_key_constraint_on":"velocity_std_dev"}},{"name":"data_vec3","using":{"foreign_key_constraint_on":"velocity"}},{"name":"rocket_sensor_message","using":{"foreign_key_constraint_on":"rocket_sensor_message_id"}}],"table":{"name":"rocket_sensor_nav_1","schema":"public"}},{"object_relationships":[{"name":"dataVec3ByPositionStdDev","using":{"foreign_key_constraint_on":"position_std_dev"}},{"name":"data_vec3","using":{"foreign_key_constraint_on":"position"}},{"name":"rocket_sensor_message","using":{"foreign_key_constraint_on":"rocket_sensor_message_id"}}],"table":{"name":"rocket_sensor_nav_2","schema":"public"}},{"object_relationships":[{"name":"data_quaternion","using":{"foreign_key_constraint_on":"quaternion"}},{"name":"data_vec3","using":{"foreign_key_constraint_on":"euler_std_dev"}},{"name":"rocket_sensor_message","using":{"foreign_key_constraint_on":"rocket_sensor_message_id"}}],"table":{"name":"rocket_sensor_quat","schema":"public"}},{"object_relationships":[{"name":"rocket_sensor_message","using":{"foreign_key_constraint_on":"rocket_sensor_message_id"}}],"table":{"name":"rocket_sensor_utc_time","schema":"public"}},{"object_relationships":[{"name":"rocket_message","using":{"foreign_key_constraint_on":"rocket_message_id"}}],"table":{"name":"rocket_state","schema":"public"}}]}],"version":3}	4
\.


--
-- Data for Name: hdb_scheduled_event_invocation_logs; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_scheduled_event_invocation_logs (id, event_id, status, request, response, created_at) FROM stdin;
\.


--
-- Data for Name: hdb_scheduled_events; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_scheduled_events (id, webhook_conf, scheduled_time, retry_conf, payload, header_conf, status, tries, created_at, next_retry_at, comment) FROM stdin;
\.


--
-- Data for Name: hdb_schema_notifications; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_schema_notifications (id, notification, resource_version, instance_id, updated_at) FROM stdin;
1	{"metadata":false,"remote_schemas":[],"sources":[],"data_connectors":[]}	4	dedc1abd-3319-4ef6-8ea8-14a727cd3f06	2024-01-24 12:34:52.00672+00
\.


--
-- Data for Name: hdb_version; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_version (hasura_uuid, version, upgraded_on, cli_state, console_state, ee_client_id, ee_client_secret) FROM stdin;
dab6a3d3-3925-44f7-97fe-b76e5e8c7587	48	2024-01-24 12:34:06.736864+00	{}	{}	\N	\N
\.


--
-- Name: hdb_action_log hdb_action_log_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_action_log
    ADD CONSTRAINT hdb_action_log_pkey PRIMARY KEY (id);


--
-- Name: hdb_cron_event_invocation_logs hdb_cron_event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_event_invocation_logs
    ADD CONSTRAINT hdb_cron_event_invocation_logs_pkey PRIMARY KEY (id);


--
-- Name: hdb_cron_events hdb_cron_events_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_events
    ADD CONSTRAINT hdb_cron_events_pkey PRIMARY KEY (id);


--
-- Name: hdb_metadata hdb_metadata_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_metadata
    ADD CONSTRAINT hdb_metadata_pkey PRIMARY KEY (id);


--
-- Name: hdb_metadata hdb_metadata_resource_version_key; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_metadata
    ADD CONSTRAINT hdb_metadata_resource_version_key UNIQUE (resource_version);


--
-- Name: hdb_scheduled_event_invocation_logs hdb_scheduled_event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_event_invocation_logs
    ADD CONSTRAINT hdb_scheduled_event_invocation_logs_pkey PRIMARY KEY (id);


--
-- Name: hdb_scheduled_events hdb_scheduled_events_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_events
    ADD CONSTRAINT hdb_scheduled_events_pkey PRIMARY KEY (id);


--
-- Name: hdb_schema_notifications hdb_schema_notifications_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_schema_notifications
    ADD CONSTRAINT hdb_schema_notifications_pkey PRIMARY KEY (id);


--
-- Name: hdb_version hdb_version_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_version
    ADD CONSTRAINT hdb_version_pkey PRIMARY KEY (hasura_uuid);


--
-- Name: hdb_cron_event_invocation_event_id; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX hdb_cron_event_invocation_event_id ON hdb_catalog.hdb_cron_event_invocation_logs USING btree (event_id);


--
-- Name: hdb_cron_event_status; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX hdb_cron_event_status ON hdb_catalog.hdb_cron_events USING btree (status);


--
-- Name: hdb_cron_events_unique_scheduled; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE UNIQUE INDEX hdb_cron_events_unique_scheduled ON hdb_catalog.hdb_cron_events USING btree (trigger_name, scheduled_time) WHERE (status = 'scheduled'::text);


--
-- Name: hdb_scheduled_event_status; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX hdb_scheduled_event_status ON hdb_catalog.hdb_scheduled_events USING btree (status);


--
-- Name: hdb_version_one_row; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE UNIQUE INDEX hdb_version_one_row ON hdb_catalog.hdb_version USING btree (((version IS NOT NULL)));


--
-- Name: hdb_cron_event_invocation_logs hdb_cron_event_invocation_logs_event_id_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_event_invocation_logs
    ADD CONSTRAINT hdb_cron_event_invocation_logs_event_id_fkey FOREIGN KEY (event_id) REFERENCES hdb_catalog.hdb_cron_events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hdb_scheduled_event_invocation_logs hdb_scheduled_event_invocation_logs_event_id_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_event_invocation_logs
    ADD CONSTRAINT hdb_scheduled_event_invocation_logs_event_id_fkey FOREIGN KEY (event_id) REFERENCES hdb_catalog.hdb_scheduled_events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

