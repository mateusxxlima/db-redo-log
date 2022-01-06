import 'dotenv/config';
import { database } from './db.js';
import { Model } from './model.js';
import { ReadFiles } from './read-files.js';
import { DBService } from './db-service.js';

class App {

  constructor() {
    this.dbService = new DBService(Model);
    this.readFiles = new ReadFiles();
  }

  async start() {
    await database.sync();
    const table = this.readFiles.readTableFile();
    await this.dbService.loadTableToDatabase(table);
    const logs = this.readFiles.readLogFile();
    await this.dbService.redo(logs);
  }
}

new App().start();