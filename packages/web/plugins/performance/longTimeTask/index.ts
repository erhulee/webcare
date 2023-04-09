import WebMonitor from "web/core/WebMonitor"
import { Plugin } from "share/Plugin"
import { LongTaskLogger } from "web/logger/index"

export class LongTimeTaskPlugin implements Plugin {
    monitor: WebMonitor
    observer!: PerformanceObserver
    constructor(monitor: WebMonitor) {
        this.monitor = monitor
    }
    init() { }
    run() {
        const callback = (entryList: PerformanceObserverEntryList) => {
            entryList.getEntries().forEach((entry) => {
                // 放宽界限
                if (entry.duration < this.monitor.longtask_time) return;
                const { startTime, duration, entryType, name } = entry
                const logger = new LongTaskLogger(startTime, duration, entryType, name)
                this.monitor.send(logger)
            });
        }
        this.observer = new PerformanceObserver(callback)
        this.observer.observe({ entryTypes: ["longtask"] });
    }
    unload() {
        this.observer?.disconnect()
    }
}

