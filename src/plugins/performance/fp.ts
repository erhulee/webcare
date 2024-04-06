import { Monitor } from "@/runtime"
import { connect } from "@/runtime/connect";
import { Plugin } from "@/types/plugin"

@connect
export class FPPlugin implements Plugin {
    monitor!: Monitor;
    observer?: PerformanceObserver
    run() {
        const entries = performance.getEntriesByType("paint");
        const fp_entry = entries.find(entry => entry.entryType == "first-paint");
        if (fp_entry) {
            console.log("fp:", fp_entry)
        } else {
            // 没有取到，挂个 observer
            this.observer = new PerformanceObserver((entries) => {
                console.log("fp entries:", entries)
            })
            this.observer.observe({
                type: "first-paint"
            })
        }
    }
    unload() {
        this.observer && this.observer.disconnect()
    }
}