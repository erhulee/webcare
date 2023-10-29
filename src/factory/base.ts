import { set } from "lodash-es";
import { SniperLog } from "src/types/log";

export function InjectEnvironmentInfo(log: Record<string, any>): void {
    const timestamp = Date.now();
    const pathname = location.pathname
    const query = location.search
    const ua = navigator.userAgent
    set(log, "env.timestamp", timestamp)
    set(log, "env.pathname", pathname)
    set(log, "env.query", query)
    set(log, "env.ua", ua)
}