import express from 'express'
import { CookieJar } from 'tough-cookie'
import SsHelper from '../core/SsHelper'

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

export async function SsSummaryController(req: express.Request, res: express.Response) {
    const uid = req.body.uid
    if (!uid) {
        msg.code = 1
        msg.status = 'error'
        msg.msg = 'Please provide your uid'
        res.json(msg)
        return
    }

    // We don't need to use the sso to reach the data, so a new CookieJar will be fine
    let ssHelper = new SsHelper(new CookieJar())
    msg.data = await ssHelper.getSummary(uid)
    res.json(msg)
}