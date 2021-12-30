import { Sequelize } from 'sequelize';
import { database } from './db.js'

export const Model = database.define('model', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  A: Sequelize.INTEGER,
  B: Sequelize.INTEGER
})