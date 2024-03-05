const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

let protoFiles = [];

let baseSearch = path.join(__dirname, '../../');
let clientOutput = path.join(__dirname, '../src/lib/proto');
let ignoreDirs = ['node_modules', 'dist', 'generated', 'coverage', 'scripts'];

function searchForProtoFiles(dir) {
	try {
		const files = fs.readdirSync(dir);
		files.forEach((file) => {
			const filePath = path.join(dir, file);
			if (fs.statSync(filePath).isDirectory() && !ignoreDirs.includes(file)) {
				searchForProtoFiles(filePath);
			} else if (filePath.endsWith('.proto')) {
				protoFiles.push(filePath);
			}
		});
	} catch (error) {
		// console.error(error);
	}
}

searchForProtoFiles(baseSearch);

console.log('protoFiles', protoFiles);

const command = `npx protoc --ts_out ${clientOutput} --proto_path ${baseSearch} ${protoFiles.join(' ')}`;

console.log('command', command);

try {
	let out = execSync(command);
	console.log('out', out.toString());
} catch (error) {
	console.error('--------------------');
	console.error('--------------------');
	console.error('--------------------');
	console.error(error);
}
