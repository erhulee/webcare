import { Monitor } from "src/runtime";
import { connect } from "src/runtime/connect";
import { SniperLog } from "src/types/log";
import { Sender } from "src/types/sender";

@connect
class XHRSender implements Sender {
    monitor!: Monitor
    get endpoint() {
        return this.monitor.endpoint
    }

    send(log: SniperLog) {
        console.log("[sniper sender]: send", log)
    }
}

export default XHRSender