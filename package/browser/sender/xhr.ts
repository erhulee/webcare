import { Monitor } from "@/runtime";
import { connect } from "@/runtime/connect";
import { SniperLog } from "@/types/log";
import { HTTPMethod } from "@/types/other";
import { Sender } from "@/types/sender";

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
    send(log: SniperLog) {
        this.buffer.push(log)
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