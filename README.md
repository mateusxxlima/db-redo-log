# db-redo-log

Project to create a redo script, which reads a log file and do a "redo" in a database

This project is implemented in NodeJS

## What Is the Redo Log?

The most crucial structure for recovery operations is the redo log, which consists of two or more preallocated files that store all changes made to the database as they occur.

## Executing the project   
### Before running the code:

* Rename the .env-example file to just .env
* Now in the .env file, adjust the values of the database credentials and the name of the log file (which must be in the root of the project)

## Running the code

```
$ npm install

$ npm start
```
