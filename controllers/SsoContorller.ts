import express from 'express'
import { v4 } from 'uuid'
import SsoHelper from '../core/SsoHelper'
import { zstuerSchema } from '../schemas/zstuer'
import { mongoClient } from '../utils/database'
/**
 * 1. code:
 * 0 ---> OK
 * 1 ---> Wrong
 * 
 * 2. status:
 * ok ---> All right
 * error ---> Something went wrong
 * 
 * 3. msg:
 * The details
 * 
 * 4. data:
 * The real response data
 */
let msg = {
    code: 0,
    status: 'ok',
    msg: 'ok',
    data: {}
}

export async function SsoLoginController(req: express.Request, res: express.Response) {
    const username = req.body.username
    const password = req.body.password
    // Check if the username and password comes in
    if (!username || !password) {
        msg.code = 1
        msg.status = 'error'
        msg.msg = 'Please provide your username and password both'
        res.end(JSON.stringify(msg))
    }
    // Create the model of Zstuer
    const zstuer = mongoClient.model('zstuer', zstuerSchema)
    
    // Try to login
    const ssoHelper = new SsoHelper(username, password)
    const status = await ssoHelper.login()
    if(status == false) {
        msg.code = 1
        msg.status = 'wrong username or password'
        msg.msg = 'Please check your username and password'
        res.end(JSON.stringify(msg))
    }
    // Logined successfully, store the cookie jar to mongodb and end with a uuidv4
    const uuid = v4()
    const cookieJar = ssoHelper.getSesstion().defaults.jar
    const expire = new Date()
    // Set the expire time to the next day
    expire.setSeconds(expire.getSeconds() + 86400)
    // Create a record in mongodb
    zstuer.create({
        username: username,
        cookie: JSON.stringify(cookieJar?.toJSON()),
        expire: expire,
        uuid: uuid.toString()
    }, (error: any, doc: any) => {
        if (error) {
            msg.code = 1
            msg.status = 'database error'
            msg.msg = 'Wait a hour and try again'
            res.end(JSON.stringify(msg))
        }
        msg.data = { uuid: uuid.toString() }
        res.end(JSON.stringify(msg))
    })
}