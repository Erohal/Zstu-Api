import { AxiosInstance } from "axios";
import { CookieJar } from "tough-cookie";
import { gzip } from "zlib";
import { createSession } from "../utils/session";

export default class SsHelper {
    private sesstion: AxiosInstance
    
    constructor(cookieJar: CookieJar) {
        this.sesstion = createSession(cookieJar)
    }

    // Return two types of run data
    public async getSummary(uid: string) {
        // { studentno, uid } gzip it, post

        const url = 'http://10.11.246.182:8029/DragonFlyServ/Api/webserver/getRunDataSummary'
        const data = JSON.stringify({
            studentno: uid,
            uid: uid
        })
        const gzipedData = await new Promise((resolve, reject) => {
            gzip(data, (err, result) => {
                if (err) {
                    reject(err)
                }
                resolve(result)
            })
        }).then((value) => {
            return value
        })

        const res = await this.sesstion({
            url: url,
            method: "POST",
            data: gzipedData
        }).then((value) => {
            return value.data
        })
        let processedData: any = { total : 0 }
        const patternOne = /区域内运动:(.*?)公里/
        const patternTwo = /校内定向跑:(.*?)公里/
        const resultOne = patternOne.exec(res.m)
        const resultTwo = patternTwo.exec(res.m)
        if (resultOne) {
            processedData.res_one = parseFloat(resultOne[1]).toFixed(1)
            processedData.total = parseFloat(processedData.res_one).toFixed(1)
        }
        if (resultTwo) {
            processedData.res_two = parseFloat(resultTwo[1]).toFixed(1)
            processedData.total = (parseFloat(processedData.res_two) + parseFloat(processedData.total)).toFixed(1)
        }
        return processedData
    }

}