import mongoose from "mongoose"
import mongooseConfig from "../configs/database.json"
import { logger } from "./logger"

// Get the database logger to log the result of database things
const databaseLogger = logger.getLogger('database')
// Start to connect to the mongodb
databaseLogger.info('Creating the connection to the mongodb')
const conn = mongoose.createConnection(mongooseConfig.uri, mongooseConfig.options)
// Set the callback and log the result
conn.on('connected', () => {
    databaseLogger.info('Successfully connected to mongodb')
})
conn.on('error', (err) => {
    databaseLogger.error('Something wrong while connecting to the mongodb, reason: ' + err)
})
conn.on('disconnected', () => {
    databaseLogger.info('Mongodb disconnected')
})


export { conn as mongoClient }