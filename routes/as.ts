import express from 'express'
import * as AsController from '../controllers/AsController'

const AsRouter = express.Router()

// Get grades contains every courses and gpa
AsRouter.post('/grades', AsController.AsGradesController)
// Get "Turn to a major" info
AsRouter.get('/tm', AsController.AsTmController)

export default AsRouter