import zmq from 'zeromq';
import type { Server as HTTPServer } from 'http';
import fs from 'fs';
import { Server } from 'socket.io';
import type {
	ChatMessage,
	ClientToServerEvents,
	ProcessedMessage,
	ServerToClientEvents
} from '$lib/common/Bindings';


import { loggerFactory } from '../logger';
export const logger = loggerFactory('io');

type Message = {
	timestamp: number;
	message: string;
	sender: string;
};

class User {
	id = '';
	secret = '';
}

class ServerData {
	loggedUsers: Map<string, User> = new Map(); // Maps socket.id to user
	userCreds: Map<string, string> = new Map(); // Maps uuid to secret for login
	tMinus: number | null = null;
	chat: Message[] = [];
}

function getUserIDs(): string[] {
	return Array.from(serverData.loggedUsers.values()).map((user) => user.id);
}

const serverData: ServerData = new ServerData();

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

	const io = new Server<ClientToServerEvents, ServerToClientEvents>(http);
	logger.info('Socket.io server started');
	io.on('connection', (socket) => {
		socket.on('disconnect', () => {
			if (serverData.loggedUsers.has(socket.id)) {
				serverData.loggedUsers.delete(socket.id);
				io.emit('loggedUsers', getUserIDs());
			}
			logger.info('Client disconnected');
		});

		// We shouldn't trust the client to send anything correct
		socket.on('chat', (msg: ChatMessage) => {
			msg.sender = serverData.loggedUsers.get(socket.id)?.id || 'Unknown';
			serverData.chat.push(msg);
			io.emit('chat', msg);
		});

		socket.on('ping', (cb) => {
			cb(Date.now());
		});

		socket.on('login', (uuid: string, secret: string) => {
			// Check if uuid is not already in use
			if (serverData.userCreds.has(uuid)) {
				// We are trying to login
				if (serverData.userCreds.get(uuid) === secret) {
					// Login successful
					serverData.loggedUsers.set(socket.id, {
						id: uuid,
						secret: secret
					});
					logger.info('Logged in user:', uuid);
					io.emit('loggedUsers', getUserIDs());
				} else {
					console.error('Login failed for user:', uuid);
				}
			} else {
				// We are trying to register
				serverData.userCreds.set(uuid, secret);
				logger.info('Registered user:', uuid);
				serverData.loggedUsers.set(socket.id, {
					id: uuid,
					secret: secret
				});
				io.emit('loggedUsers', getUserIDs());
			}
		});
	});

	const onMessage = async () => {
		for await (const [msg] of zmqSock) {
			const obj = JSON.parse(msg.toString()) as ProcessedMessage;
			if ('RocketMessage' in obj) {
				io.emit('RocketMessage', obj.RocketMessage);
			} else if ('LinkStatus' in obj) {
				io.emit('LinkStatus', obj.LinkStatus);
			} else {
				console.error('Unknown message type', obj);
			}
		}
	};

	onMessage();
};
