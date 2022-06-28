import express from 'express'
import * as AsController from '../controllers/AsController'

const AsRouter = express.Router()

// Get grades contains every courses and gpa
AsRouter.post('/grades', AsController.AsGradesController)

export default AsRouter