import { InjectEnvironmentInfo } from "./base"
import { LoggerCategory, LoggerType } from "./constant"

type Prams = {
    name: string,
    navigationType: string,
    rating: string,
    value: string | number
}
function createWebVitalLogger(params: Prams) {
    const logger = {
        category: LoggerCategory.Performance,
        type: LoggerType.WEB_VITAL,
        detail: params
    }
    InjectEnvironmentInfo(logger)
    return logger
}

export default createWebVitalLogger