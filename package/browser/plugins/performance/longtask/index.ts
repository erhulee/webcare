import createInnerLogger from "@/factory/inner";
import { Monitor } from "@/runtime"
import { connect } from "@/runtime/connect";
import { Plugin } from "@/types/plugin"
import { createLongTimeTaskLogger } from "./report";

@connect
export class LongTaskPlugin implements Plugin {
    monitor!: Monitor;
    queue: Array<PerformanceEntry> = []
    callback: PerformanceObserverCallback = (entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
            console.log("[debug]: longtime task", entry)
            // this.queue.push(entry)
            const log = createLongTimeTaskLogger({
                name: entry.name,
                duration: entry.duration,
            })
            this.monitor.send(log)
        })
    }
    observer: PerformanceObserver
    constructor() {
        this.observer = new PerformanceObserver(this.callback)
    }
    get support() {
        return window?.PerformanceObserver?.supportedEntryTypes?.includes('longtask')
    }

    run() {
        if (this.support) {
            this.observer.observe({
                entryTypes: ["longtask"],
            })
            //TODO: 后面尝试改成到空闲时段
            // requestIdleCallback(() => {
            //     this.queue.forEach(entry => {
            //         const log = createInnerLogger({
            //             message: `longtask: ${entry.name} ${entry.duration}ms`
            //         })
            //         this.monitor.send(log)
            //     })
            //     this.queue = []
            // })
        } else {
            const log = createInnerLogger({
                message: "longtask API not supported"
            })
            this.monitor.send(log)
        }
    }
    unload() {
        this.observer.disconnect()
    }
}