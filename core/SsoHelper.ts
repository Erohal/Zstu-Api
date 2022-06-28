import { Axios, AxiosInstance } from "axios"
import qs from "qs"
import CryptoJS from "crypto-js"
import { createSession } from "../utils/session"

export default class SsoHelper {
    private base_url: string = 'https://sso-443.webvpn.zstu.edu.cn/login'
    private username: string
    private password: string
    private session: AxiosInstance
    constructor(username: string, password: string) {
        this.username = username
        this.password = password
        this.session = createSession()
    }
    // return the axios object with the cookies and ...
    public getSesstion(): AxiosInstance {
        return this.session
    }
    // try to login to the both of sso and webvpn sso
    public async login() {
        const res = await this.getPageSource().then(async (value) => {
            const pageSource = value.data
            const execution = this.getExecution(pageSource)
            const crypto = this.getCrypto(pageSource)
            return await this.session({
                url: this.base_url,
                method: 'POST',
                maxRedirects: 0,
                validateStatus: () => true,
                data: qs.stringify({
                    'username': this.username,
                    'type': 'UsernamePassword',
                    '_eventId': 'submit',
                    'geolocation': '',
                    'execution': execution,
                    'captcha_code': '',
                    'croypto': crypto,
                    'password': this.encryptoPassword(this.password, crypto ?? '')
                    })
                })
        })
        // Only if the status code equals 302 that we could say it successfully logined
        // Return a promise boolean value
        if (res.status == 302) {
            await this.updateWebvpnCookie()
            await this.jasigLogin()
            return true
        } else {
            return false
        }
    }
    // Request the extra cookies, used in subsequent operations
    private async updateWebvpnCookie() {
        const updateUrl: string = 'https://webvpn.zstu.edu.cn/vpn_key/update'
        await this.session({
            url: updateUrl,
            method: 'GET',
            validateStatus: () => true            
        })
    }
    // To request academic system, we need to request this first
    private async jasigLogin() {
        const jasigLoginUrl: string = 'https://jwglxt.webvpn.zstu.edu.cn/sso/jasiglogin'
        await this.session({
            url: jasigLoginUrl,
            method: 'GET',
            validateStatus: () => true
        })
    }
    // Actually only when we can not get the html that the result will be undefined
    private getExecution(data: string) {
        const executionReg = /<p id="login-page-flowkey">(.*?)<\/p>/
        const result = executionReg.exec(data)
        if (result) {
            return result[1]
        }
    }
    // Same as above
    private getCrypto(data: string) {
        const cryptoReg = /<p id="login-croypto">(.*?)<\/p>/
        const result = cryptoReg.exec(data)
        if (result) {
            return result[1]
        }
    }
    private async getPageSource() {
        return await this.session({
            url: this.base_url,
            method: 'GET'
        })
    }
    private encryptoPassword(password: string, crypto: string) {
        return CryptoJS.DES.encrypt(password, CryptoJS.enc.Base64.parse(crypto), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }).toString()
    }
}