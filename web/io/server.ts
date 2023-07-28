import zmq from 'zeromq';
import type { Server as HTTPServer } from 'http';
import fs from 'fs';
import { Server } from 'socket.io';


import { loggerFactory } from '../logger';
export const logger = loggerFactory('io');

export const setupServer = (http: HTTPServer) => {
	// If data folder is not present, create it
	if (!fs.existsSync('io/data')) {
		logger.info('Created data folder');
		fs.mkdirSync('io/data');
	}

	const zmqSock = new zmq.Publisher();
	let sockState: 'bound' | 'unbound' | 'binding' = 'unbound';
	// zmqSock.subscribe();

	const io = new Server(http);
	logger.info('Socket.io server started');
	io.on('connection', (socket) => {
		logger.info('Client connected: ', socket.handshake.address);

		socket.on('disconnect', () => {
			logger.info('Client disconnected: ', socket.handshake.address);
		});

		socket.on('ping', (cb: Function) => {
			cb(Date.now());
		});
	});
};
