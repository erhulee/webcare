import { InjectEnvironmentInfo } from "@/factory/base";
import { LoggerCategory, LoggerType } from "@/factory/constant";

export function createLongTimeTaskLogger(params: {
    duration: number,
    name: PerformanceEntry['name'],
}) {
    const logger = {
        category: LoggerCategory.Performance,
        type: LoggerType.LONG_TIME_TASK,
        detail: params
    }
    return InjectEnvironmentInfo(logger)
}