import 'dotenv/config';
import { database } from './db.js';
import { Model } from './model.js';
import { ReadFiles } from './read-files.js';
import { DBService } from './db-service.js';

const dbService = new DBService(Model);
const readFiles = new ReadFiles()

async function start() {
  await database.sync();
  const table = readFiles.readTableFile();
  await dbService.loadTableToDatabase(table);
}

start()