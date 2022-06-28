import log4js from 'log4js'
import * as log4jsConfig from '../configs/logger.json'

log4js.configure(log4jsConfig)

export { log4js as logger }