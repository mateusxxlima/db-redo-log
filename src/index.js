import 'dotenv/config';

import { readFileSync } from 'fs';
import { database } from './db.js';
import { Model } from './model.js';
import { File } from './file.js';
import { DBService } from './db-service.js';

class App {

  constructor() {
    this.fileInBuffer = readFileSync('file.txt');
    this.file = new File(this.fileInBuffer);
    this.dbService = new DBService(Model);
  }

  async start() {
    await database.sync();
    await this.dbService.loadTableToDatabase(this.file.table);
    await this.dbService.redo(this.file.logs);
  }
}

new App().start();