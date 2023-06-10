import zmq from 'zeromq';
import type { Server as HTTPServer } from 'http';
import PocketBase from 'pocketbase';
// Ayo? 🤨
import cp from 'child_process';
import { loggerFactory } from '../logger';
import type { Message } from '../../hydra_provider/bindings/Message';
import type { Data } from '../../hydra_provider/bindings/Data';
import type { State } from '../../hydra_provider/bindings/State';
import type { Sensor } from '../../hydra_provider/bindings/Sensor';
import type { Log } from '../../hydra_provider/bindings/Log';
export const logger = loggerFactory('db');

export const setupServer = async (http: HTTPServer) => {
	logger.info('Started DB Service');
	try {
		// Kill any existing PocketBase instances
		cp.execSync('killall pocketbase');
		logger.info('Killed all pocketBase instances');
	} catch (e) {
		// Ignore
	}

	logger.info('Starting PocketBase Server');
	const pbServer = cp.spawn('./db/pocketbase', ['serve'], {
		stdio: ['inherit', 'inherit', 'inherit', 'ipc']
	});
	// Kill PocketBase server on exit
	http.addListener('close', async () => {
		logger.warn('Killing PocketBase Server');
		pbServer?.kill();
	});

	// Keep calling http://127.0.0.1:8090/api/health until it responds
	const TIMEOUT = 5000;
	const start = Date.now();
	let started = false;
	while (!started) {
		try {
			const res = await fetch('http://127.0.0.1:8090/api/health', {
				method: 'GET'
			});
			if (res.status === 200) {
				logger.info('PocketBase server started successfully');
				started = true;
			}
		} catch (e) {
			// Ignore
		}
		if (Date.now() - start > TIMEOUT) {
			logger.error('PocketBase server did not start in time');
			throw new Error('PocketBase server did not start in time');
		}
	}

	// Connect to PocketBase server
	if (process.env.DB_ADMIN === undefined || process.env.DB_ADMIN === '') {
		logger.error('DB_ADMIN is not set');
		throw new Error('DB_ADMIN is not set');
	}
	if (process.env.DB_ADMIN_PASSWORD === undefined || process.env.DB_ADMIN_PASSWORD === '') {
		logger.error('DB_ADMIN_PASSWORD is not set');
		throw new Error('DB_ADMIN_PASSWORD is not set');
	}
	if (process.env.DB_REST_PORT === undefined || process.env.DB_REST_PORT === '') {
		logger.error('DB_REST_PORT is not set');
		throw new Error('DB_REST_PORT is not set');
	}

	logger.info('Connecting to PocketBase server');
	const pb = new PocketBase(`http://127.0.0.1:${process.env.DB_REST_PORT ?? '8090'}`);
	await pb.admins.authWithPassword(process.env.DB_ADMIN, process.env.DB_ADMIN_PASSWORD);

	// Setup ZMQ subscriber
	const zmqSock = new zmq.Subscriber();
	zmqSock.connect(`tcp://localhost:${process.env.ZMQ_PORT ?? '3002'}`);
	zmqSock.subscribe();

	// Listen and store messages
	for await (const [msg] of zmqSock) {
		const obj = JSON.parse(msg.toString());
		if ('RocketMessage' in obj) {
			const rocketMsg = obj.RocketMessage;
			const rocketData = rocketMsg.data as Data;
			// { state: State } | { sensor: Sensor } | { log: Log };
			if ('state' in rocketData) {
				const dataState = rocketData.state as State;
				console.log("state");
			} else if ('sensor' in rocketData) {
				const dataSensor = rocketData.sensor as Sensor;
				const sensorData = dataSensor.data;
				if ('UtcTime' in sensorData) {
					// logger.info('Adding UtcTime');
				} else if ('Air' in sensorData) {
					// logger.info('Adding Air');
				} else if ('EkfQuat' in sensorData) {
					logger.info("Sending quats");
					pb.collection("EkfQuat").create({
						"timestamp": sensorData.EkfQuat.time_stamp,
						"q0": sensorData.EkfQuat.quaternion[0],
						"q1": sensorData.EkfQuat.quaternion[1],
						"q2": sensorData.EkfQuat.quaternion[2],
						"q3": sensorData.EkfQuat.quaternion[3],
						"roll": sensorData.EkfQuat.euler_std_dev[0],
						"pitch": sensorData.EkfQuat.euler_std_dev[1],
						"yaw": sensorData.EkfQuat.euler_std_dev[2],
						"status": sensorData.EkfQuat.status,
					}, {
						$autoCancel: false
					});
					// logger.info('Adding EkfQuat');
				} else if ('EkfNav1' in sensorData) {
					// logger.info('Adding EkfNav1');
				} else if ('EkfNav2' in sensorData) {
					// logger.info('Adding EkfNav2');
				} else if ('Imu1' in sensorData) {
					// console.log(sensorData.Imu1);
					// logger.info('Adding Imu1');
				} else if ('Imu2' in sensorData) {
					// console.log(sensorData.Imu2);
					// logger.info('Adding Imu2');
				} else if ('GpsVel' in sensorData) {
					// logger.info('Adding GpsVel');
				}


			} else if ('log' in rocketData) {
				const dataLog = rocketData.log as Log;
				console.log("log");
			}
		} else if ('LinkStatus' in obj) {
			// logger.info('Adding Link Status');
		} else {
			// logger.error('Unknown message type', obj);
		}
	}
};
