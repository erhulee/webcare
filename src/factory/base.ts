import { set } from "lodash-es";
import { LoggerEnv } from "./interface";

export function InjectEnvironmentInfo<T extends Record<string, any>>(log: T) {
    const timestamp = Date.now();
    const pathname = location.pathname
    const query = location.search
    const ua = navigator.userAgent
    set(log, "timestamp", timestamp)
    set(log, "pathname", pathname)
    set(log, "query", query)
    set(log, "ua", ua)
    return log as T & LoggerEnv
}