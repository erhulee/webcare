import { Monitor } from "src/runtime";
import { connect } from "src/runtime/connect";
import { SniperLog } from "src/types/log";
import { HTTPMethod } from "src/types/other";
import { Sender } from "src/types/sender";

@connect
class XHRSender implements Sender {
    monitor!: Monitor
    method: HTTPMethod
    get endpoint() {
        return this.monitor.endpoint
    }
    constructor(method: HTTPMethod) {
        this.method = method
    }
    send(log: SniperLog) {
        const origin_open = this.monitor.getHijackFn("open", XMLHttpRequest.prototype.open)
        const origin_send = this.monitor.getHijackFn("send")
        const xhr = new XMLHttpRequest();
        origin_open.call(xhr, this.method, this.endpoint);
        xhr.setRequestHeader("Content-Type", 'application/json');
        origin_send.call(xhr, JSON.stringify(log))
    }
}

export default XHRSender