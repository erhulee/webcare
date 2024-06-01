import { InjectEnvironmentInfo } from "./base"
import { LoggerCategory, LoggerType } from "./constant"

export default function createTimingLogger(params: {
    dns: number,
    tcp: number,
    ttfb: number,
    request: number,
    dom: number,
    duration: number
}) {
    return InjectEnvironmentInfo({
        category: LoggerCategory.Behavior,
        type: LoggerType.TIMING,
        url: params
    })
}