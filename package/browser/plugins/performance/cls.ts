import { Monitor } from "@/runtime"
import { connect } from "@/runtime/connect";
import { Plugin } from "@/types/plugin"

@connect
export class CLSPlugin implements Plugin {
    monitor!: Monitor;
    callback: PerformanceObserverCallback = (entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
        })
    }
    observer: PerformanceObserver
    constructor() {
        this.observer = new PerformanceObserver(this.callback)
    }
    run() {
        this.observer.observe({
            type: "layout-shift",
            buffered: true
        })
    }
    unload() {
        this.observer.disconnect()
    }
}