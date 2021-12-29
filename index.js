import 'dotenv/config';
import './model.js';
import { database } from './db.js';

async function start() {
  await database.sync()
}

start()