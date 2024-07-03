import { Monitor } from "@/runtime"
import { InjectEnvironmentInfo } from "./base"
import { LoggerCategory, LoggerType } from "./constant"

export default function createJSErrorLogger(params: {
    stack: string,
    message: string
}, monitor?: Monitor) {
    return InjectEnvironmentInfo({
        category: LoggerCategory.Stability,
        type: LoggerType.JS_ERROR,
        detail: params
    })
}



