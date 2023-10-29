import { Monitor } from "src/runtime"
import { InjectEnvironmentInfo } from "./base"

export default function createJSErrorLogger(params: {
    stack: string,
    message: string
}, monitor?: Monitor) {
    const logger = {
        category: "stability",
        type: "js_error",
        detail: params
    }
    InjectEnvironmentInfo(logger)
    return logger
}



