import { AxiosInstance } from "axios";
import qs from "qs";
import { CookieJar } from "tough-cookie";
import { createSession } from "../utils/session";

export default class AsHelper {
    private cookieJar: CookieJar
    private sesstion: AxiosInstance
    
    constructor(cookieJar: CookieJar) {
        this.cookieJar = cookieJar
        this.sesstion = createSession(cookieJar)
    }

    public async getGrades() {
        const url = 'https://jwglxt.webvpn.zstu.edu.cn/jwglxt/cjcx/cjcx_cxXsgrcj.html?doType=query'
        const data = {
            'queryModel.showCount': 5000
        }
        const res = await this.sesstion({
            url: url,
            method: 'POST',
            data: qs.stringify(data)
        }).then((value) => {
            return value.data
        })
        return res
    }
}