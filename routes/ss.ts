import express from 'express'
import * as SsController from '../controllers/SsController'

const SsRouter = express.Router()

// Get the total kilos that you had ran
SsRouter.post('/summary', SsController.SsSummaryController)

export default SsRouter