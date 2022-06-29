import express from 'express'
import { CookieJar } from 'tough-cookie'
import AsHelper from '../core/AsHelper'
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

function checkSessionExpire(date: Date) {
    return (new Date() > date) ? false : true
}

export async function AsGradesController(req: express.Request, res: express.Response) {
    const uuid = req.body.uuid
    if (!uuid) {
        msg.code = 1
        msg.status = 'error',
        msg.msg = 'Please provide uuid'
        res.json(msg)
        return
    }

    const zstuer = mongoClient.model('zstuer', zstuerSchema)
    const record: any = await zstuer.findOne({ uuid: uuid }).then((docs: any) => {
        return docs
    })

    if (!record) {
        msg.code = 1
        msg.status = 'error'
        msg.msg = 'Your uuid is wrong'
        res.json(msg)
        return
    }

    if (!checkSessionExpire(record.expire)) {
        msg.code = 1
        msg.status = 'error'
        msg.msg = 'Session expire, please relogin'
        res.json(msg)
        return
    }

    // User had logined, restore the cookie from json
    const cookieJar = CookieJar.fromJSON(record.cookie)
    const asHelper = new AsHelper(cookieJar)
    msg.data = await asHelper.getGrades()
    res.json(msg)
}

export async function AsTmController(req: express.Request, res: express.Response) {
    const uuid = req.body.uuid
    if (!uuid) {
        msg.code = 1
        msg.status = 'error',
        msg.msg = 'Please provide uuid'
        res.json(msg)
        return
    }

    const zstuer = mongoClient.model('zstuer', zstuerSchema)
    const record: any = await zstuer.findOne({ uuid: uuid }).then((docs: any) => {
        return docs
    })

    if (!record) {
        msg.code = 1
        msg.status = 'error'
        msg.msg = 'Your uuid is wrong'
        res.json(msg)
        return
    }

    if (!checkSessionExpire(record.expire)) {
        msg.code = 1
        msg.status = 'error'
        msg.msg = 'Session expire, please relogin'
        res.json(msg)
        return
    }

    // User had logined, restore the cookie from json
    const cookieJar = CookieJar.fromJSON(record.cookie)
    const asHelper = new AsHelper(cookieJar)
    msg.data = await asHelper.getTM()
    res.json(msg)
}