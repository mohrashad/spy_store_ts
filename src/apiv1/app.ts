import 'reflect-metadata';
import { Server } from './server/Server';

const server: Server = new Server();
server.listen();