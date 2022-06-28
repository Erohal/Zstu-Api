import express from 'express'
import * as SsoContorller from '../controllers/SsoContorller'

const SsoRouter = express.Router()

// Login to sso
SsoRouter.post('/login', SsoContorller.SsoLoginController)

export default SsoRouter