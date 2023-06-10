import zmq from 'zeromq';
import type { Server as HTTPServer } from 'http';
import fs from 'fs';
import { Server } from 'socket.io';

import { loggerFactory } from '../logger';
import type { Message } from '../../hydra_provider/bindings/Message';
export const logger = loggerFactory('io');








export const setupServer = (http: HTTPServer) => {
	// If data folder is not present, create it
	if (!fs.existsSync('io/data')) {
		logger.info('Created data folder');
		fs.mkdirSync('io/data');
	}



	// If server.json is not present, create it
	if (!fs.existsSync('io/data/server.json')) {
		logger.info('Created server.json');
		// We will use this file to store the state of the server
		fs.writeFileSync('io/data/server.json', JSON.stringify({}));
	}

	// expect zmq sub socket to run on port 3002
	const zmqSock = new zmq.Subscriber();
	// get env ZMQ_PORT
	zmqSock.connect(`tcp://127.0.0.1:${process.env.ZMQ_PORT ?? '3002'}`);
	zmqSock.subscribe();

	const io = new Server(http);
	logger.info('Socket.io server started');
	// io.on('connection', (socket) => {
	// 	socket.on('disconnect', () => {
	// 		if (serverData.loggedUsers.has(socket.id)) {
	// 			serverData.loggedUsers.delete(socket.id);
	// 			io.emit('loggedUsers', getUserIDs());
	// 		}
	// 		logger.info('Client disconnected');
	// 	});

	// 	socket.on('ping', (cb) => {
	// 		cb(Date.now());
	// 	});
	// });

	const onMessage = async () => {
		for await (const [msg] of zmqSock) {
			const obj = JSON.parse(msg.toString()) as Message;
			// if ('RocketMessage' in obj) {
			// 	io.emit('RocketMessage', obj.RocketMessage);
			// } else if ('LinkStatus' in obj) {
			// 	io.emit('LinkStatus', obj.LinkStatus);
			// } else {
			// 	console.error('Unknown message type', obj);
			// }
		}
	};

	onMessage();
};
