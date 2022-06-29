import { AxiosInstance } from "axios";
import qs from "qs";
import { CookieJar } from "tough-cookie";
import { createSession } from "../utils/session";

export default class AsHelper {
    private sesstion: AxiosInstance
    
    constructor(cookieJar: CookieJar) {
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

        let processedRes: any = {}
        let items = []
        let totalCredits: number = 0
        let totalFps: number = 0
        /**
         * res.items[item].cj   ---> Percentage grades
         * res.items[item].kcmc ---> Name of the couse
         * res.items[item].jd   ---> Five-point scale
         * res.items[item].xf   ---> Credits
         * res.items[item].xfjd ---> Credits * Five-point scale
         * res.items[item].tjsj ---> Update time
         * res.items[item].tjrxm ---> teacher
         */
        for (let item in res.items) {
            let curse: any = {}
            curse.grade = res.items[item].cj
            curse.name = res.items[item].kcmc
            curse.jd = res.items[item].jd
            curse.xf = res.items[item].xf
            curse.xfjd = res.items[item].xfjd
            curse.time = res.items[item].tjsj
            curse.teacher = res.items[item].tjrxm
            // Ignore the waiver and make-up options
            if (curse.grade != '放弃' && curse.grade != '补考一') {
                totalCredits += parseFloat(res.items[item].xfjd)
                totalFps += parseFloat(res.items[item].xf)
            }
            items.push(curse)
        }
        processedRes.items = items
        processedRes.gpa = (totalCredits / totalFps).toFixed(2)
        console.log(processedRes.gpa)
        return processedRes
    }
}