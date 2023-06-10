import zmq from 'zeromq';
import type { Server as HTTPServer } from 'http';
import PocketBase from 'pocketbase';
// Ayo? 🤨
import cp from 'child_process';
import { loggerFactory } from '../logger';
import type { ProcessedMessage } from '$lib/common/bindings';
export const logger = loggerFactory('db');

export const setupServer = async (http: HTTPServer) => {
	// Check if PocketBase is already running
	let pbServer: cp.ChildProcess;
	let pb: PocketBase;

	logger.info('Started DB Service');
	try {
		// Kill any existing PocketBase instances
		cp.execSync('killall pocketbase');
		logger.info('Killed all pocketBase instances');
	} catch (e) {
		// Ignore
	}

	logger.info('Starting PocketBase Server');
	pbServer = cp.spawn('./db/pocketbase', ['serve'], {
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
	while (true) {
		try {
			const res = await fetch('http://127.0.0.1:8090/api/health', {
				method: 'GET'
			});
			if (res.status === 200) {
				logger.info('PocketBase server started successfully');
				break;
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
	pb = new PocketBase(`http://127.0.0.1:${process.env.DB_REST_PORT ?? '8090'}`);
	const auth = await pb.admins.authWithPassword(
		process.env.DB_ADMIN,
		process.env.DB_ADMIN_PASSWORD
	);

	// Setup ZMQ subscriber
	const zmqSock = new zmq.Subscriber();
	zmqSock.connect(`tcp://localhost:${process.env.ZMQ_PORT ?? '3002'}`);
	zmqSock.subscribe();

	// Listen and store messages
	for await (const [msg] of zmqSock) {
		const obj = JSON.parse(msg.toString()) as ProcessedMessage;
		if ('RocketMessage' in obj) {
			const rocketMsg = obj.RocketMessage;
			if ('state' in rocketMsg.data) {
				pb.collection('state').create(rocketMsg.data.state);
				// logger.info("Adding State");
			} else {
				pb.collection('sbg').create(rocketMsg.data.sensor.data.Sbg);
				// logger.info("Adding SBG");
			}
		} else if ('LinkStatus' in obj) {
			pb.collection('link_status').create(obj.LinkStatus);
			// logger.info("Adding Link Status");
		} else {
			logger.error('Unknown message type', obj);
		}
	}
};
