import { CommonTrack } from "@/common_track/type";
import { LoggerCategory, LoggerType } from "@/factory/constant";
import { Monitor } from "@/runtime";
import { connect } from "@/runtime/connect";
import { SniperLog } from "@/types/log";
import { HTTPMethod } from "@/types/other";
import { Sender } from "@/types/sender";
type OriginLog = {
    category: string;
    type: string;
    detail: Record<string, any>
    timestamp: number;
    pathname: string;
    query: string;
    ua: string;
    href: string;
    deviceID: string;
    sessionID: string;
    appid: string;
    extra?: {

    }
}

@connect
class XHRSender implements Sender {
    monitor!: Monitor
    method: HTTPMethod

    buffer: any[] = []

    get endpoint() {
        return this.monitor.endpoint
    }
    constructor(method: HTTPMethod) {
        this.method = method
        setInterval(() => {
            this.schedule()
        }, 1000)
    }
    send(log: OriginLog) {
        const { timestamp, pathname, query, ua } = log;
        let _log: CommonTrack = {
            $event: `${log.category}_${log.type}`,
            $timestamp: timestamp,
            $pathname: pathname,
            $query: query,
            $ua: ua
        };
        Object.assign(_log, log.detail);
        Object.assign(_log, log.extra);
        Object.assign(_log, {
            $appid: log.appid,
            $deviceID: log.deviceID,
            $sessionID: log.sessionID,
            $href: log.href,
        })
        this.buffer.push(_log)
    }

    schedule() {
        if (this.buffer.length <= 0) return;
        const origin_open = this.monitor.getHijackFn("open", XMLHttpRequest.prototype.open)
        const origin_send = this.monitor.getHijackFn("send")
        const xhr = new XMLHttpRequest();
        origin_open.call(xhr, this.method, this.endpoint);
        xhr.setRequestHeader("Content-Type", 'application/json');
        origin_send.call(xhr, JSON.stringify({
            loggers: this.buffer,
        }))
        this.buffer = []
    }
}

export default XHRSender