import { set } from "lodash-es";
import { LoggerEnv } from "./interface";

export function InjectEnvironmentInfo<T extends Record<string, any>>(log: T) {
    const monitor = window.__SNIPER__
    const timestamp = Date.now();
    const pathname = location.pathname
    const query = location.search
    const href = location.href
    const ua = navigator.userAgent
    const did = monitor.deviceID
    const session = monitor.sessionID
    set(log, "timestamp", timestamp)
    set(log, "pathname", pathname)
    set(log, "query", query)
    set(log, "ua", ua);
    set(log, "href", href);
    set(log, "deviceID", did);
    set(log, "sessionID", session);
    (monitor.uid) && set(log, "uid", monitor.uid);
    (monitor.appid) && set(log, "appid", monitor.appid)
    return log as T & LoggerEnv
}