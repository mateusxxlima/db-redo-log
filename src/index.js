import 'dotenv/config';

import { readFileSync } from 'fs';
import { database } from './db.js';
import { Model } from './model.js';
import { File } from './file.js';
import { DBService } from './db-service.js';

class App {

  constructor() {
    this.fileInBuffer = readFileSync(process.env.LOG_FILE_NAME);
    this.file = new File(this.fileInBuffer);
    this.dbService = new DBService(Model);
  }

  async start() {
    await database.sync();
    await this.dbService.loadTableToDatabase(this.file.table);
    await this.dbService.redo(this.file.logs);
    this.dbService.willItBeRedo();
    this.dbService.doNotWillBeRedo(this.file.logs);
    await this.dbService.finalPrint();
  }
}

new App().start();