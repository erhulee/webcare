import { Monitor } from "@/runtime";
import { connect } from "@/runtime/connect";
import { SniperLog } from "@/types/log";
import { HTTPMethod } from "@/types/other";
import { Sender } from "@/types/sender";

@connect
class BeaconSender implements Sender {
    monitor!: Monitor
    method: HTTPMethod = "post"
    get endpoint() {
        return this.monitor.endpoint
    }
    send(log: SniperLog) {
        const has_beacon = Boolean(window.navigator.sendBeacon)
        if (has_beacon) {
            window.navigator.sendBeacon(this.monitor.endpoint, JSON.stringify(log))
        }
    }
}

export default BeaconSender