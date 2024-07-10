import { InjectEnvironmentInfo } from "./base"
import { LoggerCategory, LoggerType } from "./constant"

export default function createInnerLogger(params: {
    message: string
}) {
    return InjectEnvironmentInfo({
        category: LoggerCategory.Performance,
        type: LoggerType.Inner,
        detail: {
            message: params.message
        }
    })
}