import { startServer } from './server.js';
import { ininMongoDB } from './db/ininMongoDB.js';
import { startRequestInterval } from './utils/startRequestInterval.js';

const boostrap = async () => {
  await ininMongoDB();
  startServer();
  startRequestInterval(8 * 60 * 1000);
};

boostrap();
