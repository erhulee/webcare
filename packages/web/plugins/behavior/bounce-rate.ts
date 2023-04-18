// 跳出率
import WebMonitor from "web/core/WebMonitor"
import { Plugin } from "@sniper/core"
import { BounceRateLogger } from "web/logger";
const DEFAULT_BOUNCE_RATE_EVENT_COUNT = 2;
export class BounceRatePlugin implements Plugin {
    monitor: WebMonitor
    // 上一次访问的地址
    prePath!: string
    constructor(monitor: WebMonitor) {
        this.monitor = monitor
    }
    init() {
        this.prePath = location.href;
    }
    run() {
        const _trackPV = this.monitor.trackPV;
        this.monitor.trackPV = () => {
            _trackPV.call(this.monitor);
            const curPath = location.href;
            const prePath = this.prePath;
            const activeEventCount = this.monitor.eventStack.filter((item) => prePath == item.pathName).length;
            if (activeEventCount <= DEFAULT_BOUNCE_RATE_EVENT_COUNT) {
                const log = new BounceRateLogger(this.prePath);
                this.monitor.send(log)
            }
            this.prePath = curPath;
        }
    }
    unload() {

    }
}


