import { InjectEnvironmentInfo } from "./base";
import { LoggerCategory, LoggerType } from "./constant";
import { Logger } from "./interface";

export type HTTPLoggerDetail = {
    method?: "get" | "post" | "delete" | "put"
    url: string,
    query?: string,
    body?: string
    status: number;
    status_text: string
}
export type HTTPLogger = Logger<HTTPLoggerDetail> & {
    category: LoggerCategory.Stability,
    type: LoggerType.HTTP
}
export default function createHTTPErrorLogger(params: HTTPLoggerDetail) {
    const logger: HTTPLogger = {
        category: LoggerCategory.Stability,
        type: LoggerType.HTTP,
        detail: params
    }
    InjectEnvironmentInfo(logger)
    return logger
}