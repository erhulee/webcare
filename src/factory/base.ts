import { set } from "lodash-es";
import { LoggerEnv } from "./interface";

export function InjectEnvironmentInfo<T extends Record<string, any>>(log: T) {
    const timestamp = Date.now();
    const pathname = location.pathname
    const query = location.search
    const ua = navigator.userAgent
    set(log, "env.timestamp", timestamp)
    set(log, "env.pathname", pathname)
    set(log, "env.query", query)
    set(log, "env.ua", ua)
    return log as T & LoggerEnv
}