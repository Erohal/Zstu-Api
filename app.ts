import express from 'express'
import * as expressConfig from './configs/express.json'
import { logger } from './utils/logger'
import SsoRouter from './routes/sso'

// Get two loggers, default logger to log the normal info and the express logger to replace the default logger of express
const defaultLogger = logger.getLogger()
const expressLogger = logger.getLogger('express')
// init all express instance
defaultLogger.info('Preparing')
const app: express.Application = express()
// We use the json parser to parse the user input
defaultLogger.info('Using json parser')
app.use(express.json())
// Replace the default logger of express
defaultLogger.info('Using log4js as logger of express')
app.use(logger.connectLogger(expressLogger, {}))
// Register the routers
defaultLogger.info('Registing the SsoRouter')
app.use('/sso', SsoRouter)
// Start to serve on a specified port, default port is 80
defaultLogger.info('Ready to serve')
app.listen(expressConfig.port, () => {
    defaultLogger.info('Service started successfully')
})