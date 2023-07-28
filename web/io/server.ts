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

		// Mock commands:
		// mock/start | Start a zmq publisher binding to port
		// mock/stop  | Stop the zmq publisher
		// mock/send  | Send a message to the zmq publisher
		// mock/status | Get the status of the zmq publisher (running or not)
		socket.on('mock/start', async (port: number) => {
			if (sockState === 'bound') {
				socket.emit('mock/status', 'Already bound');
				return;
			} else if (sockState === 'binding') {
				socket.emit('mock/status', 'Already binding');
				return
			}
			socket.emit('mock/status', 'Binding');
			await zmqSock.bind(`tcp://*:${process.env.ZMQ_PORT ?? '3002'}`);
			sockState = 'bound';
			socket.emit('mock/status', 'Bound');
		});

		socket.on('mock/stop', async () => {
			if (sockState === 'unbound') {
				socket.emit('mock/status', 'Already unbound');
				return;
			}
			socket.emit('mock/status', 'Unbinding');
			await zmqSock.unbind(`tcp://*:${process.env.ZMQ_PORT ?? '3002'}`);
			sockState = 'unbound';
		});

		socket.on('mock/send', async (msg: string) => {
			if (sockState === 'unbound' || sockState === 'binding') {
				socket.emit('mock/status', 'Not bound');
				return;
			}
			// Act as a proxy for the client
			await zmqSock.send(msg);
			socket.emit('mock/status', 'Sent message');
		});

		socket.on('mock/status', () => {
			socket.emit('mock/status', sockState);
		});
	});
};
