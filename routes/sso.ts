import express from 'express'
import * as SsoContorller from '../controllers/SsoContorller'
const SsoRouter = express.Router()

SsoRouter.post('/login', SsoContorller.SsoLoginController)
export default SsoRouter