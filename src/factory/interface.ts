import { LoggerCategory, LoggerType } from "./constant"

export interface Logger<T = any> {
    category: LoggerCategory
    type: LoggerType
    detail: T
}

export type LoggerEnv = {
    env: {
        timestamp: number,
        pathname: string,
        query: string,
        ua: string
    }
}