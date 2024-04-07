import createFPLogger from "@/factory/fp";
import { Monitor } from "@/runtime"
import { connect } from "@/runtime/connect";
import { Plugin } from "@/types/plugin"

@connect
export class FPPlugin implements Plugin {
    monitor!: Monitor;
    observer?: PerformanceObserver
    run() {
        const entries = performance.getEntriesByType("paint");
        const fp_entry = entries.find(entry => entry.name == "first-paint");
        if (fp_entry) {
            const logger = createFPLogger({ value: fp_entry.startTime })
            this.monitor.send(logger)
        } else {
            // 没有取到，挂个 observer
            this.observer = new PerformanceObserver((entries) => {
                const fp_entry = entries.getEntriesByType("paint").find(entry => entry.name == "first-paint")
                const logger = createFPLogger({ value: fp_entry!.startTime })
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