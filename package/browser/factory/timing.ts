import { InjectEnvironmentInfo } from "./base"
import { LoggerCategory, LoggerType } from "./constant"

export default function createTimingLogger(params: {
    metric: {
        dns: number,
        tcp: number,
        ttfb: number,
        request: number,
        dom: number,
        duration: number
    },
    domainLookupEnd: number,
    domainLookupStart: number,
    connectEnd: number,
    connectStart: number,
    responseStart: number,
    responseEnd: number,
    fetchStart: number,
    requestStart: number,
    domComplete: number,
    domInteractive: number,
    loadEventEnd: number,
    redirectStart: number,
    duration: number
}) {
    return InjectEnvironmentInfo({
        category: LoggerCategory.Performance,
        type: LoggerType.TIMING,
        detail: params
    })
}