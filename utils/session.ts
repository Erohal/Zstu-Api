import axios from "axios"
import { wrapper } from "axios-cookiejar-support"
import { CookieJar } from "tough-cookie"

export function createSession(jar: CookieJar = new CookieJar()) {
    const session = wrapper(axios.create({ jar }))
    return session
}