import { InjectEnvironmentInfo } from "./base";
import { LoggerCategory, LoggerType } from "./constant";
import { Logger } from "./interface";

export type FPLogger = Logger<number> & {
    category: LoggerCategory.Performance,
    type: LoggerType.FP
}
export default function createFPLogger(params: { value: number }) {
    return InjectEnvironmentInfo({
        category: LoggerCategory.Performance,
        type: LoggerType.FP,
        detail: params.value
    })
}