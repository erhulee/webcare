import createFCPLogger from "@/factory/fcp";
import { Monitor } from "@/runtime"
import { connect } from "@/runtime/connect";
import { Plugin } from "@/types/plugin"

@connect
export class FCPPlugin implements Plugin {
    monitor!: Monitor;
    observer?: PerformanceObserver
    run() {
        const entries = performance.getEntriesByType("paint");
        const fp_entry = entries.find(entry => entry.name == "first-paint");
        console.log("fcp plugin:", entries)
        if (fp_entry) {
            const logger = createFCPLogger({ value: fp_entry.startTime })
            this.monitor.send(logger)
        } else {
            // 没有取到，挂个 observer
            this.observer = new PerformanceObserver((entries) => {
                const fp_entry = entries.getEntriesByType("paint").find(entry => entry.name == "first-contentful-paint")
                /**
                 * {
                        "name": "first-paint",
                        "entryType": "paint",
                        "startTime": 591.5,
                        "duration": 0
                    }
                 */
                const fp_value = fp_entry!.startTime;
                //TODO: 上报一下
                const logger = createFCPLogger({ value: fp_value })
                this.monitor.send(logger)
            })
            this.observer.observe({
                type: "paint"
            })
        }
    }
    unload() {
        this.observer && this.observer.disconnect()
    }
}