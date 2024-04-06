import { InjectEnvironmentInfo } from "./base";
import { LoggerCategory, LoggerType } from "./constant";
import { Logger } from "./interface";

export type FCPLogger = Logger<number> & {
    category: LoggerCategory.Performance,
    type: LoggerType.FCP
}
export default function createFCPLogger(params: { value: number }) {
    return InjectEnvironmentInfo({
        category: LoggerCategory.Performance,
        type: LoggerType.FCP,
        detail: params.value
    })
}