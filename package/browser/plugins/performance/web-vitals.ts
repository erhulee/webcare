import createWebVitalLogger from "@/factory/webvital";
import { Monitor } from "@/runtime"
import { connect } from "@/runtime/connect";
import { Plugin } from "@/types/plugin"
import { onCLS, onFCP, onTTFB, onFID, onLCP, onINP, Metric } from "web-vitals";

@connect
export class WebVitalsPlugin implements Plugin {
    monitor!: Monitor;
    callback = (event: Metric) => {
        const logger = createWebVitalLogger({
            name: event.name,
            navigationType: event.navigationType,
            rating: event.rating,
            value: event.value
        })
        this.monitor.send(logger)
    }
    run() {
        onCLS(this.callback)
        onFID(this.callback)
        onFCP(this.callback)
        onTTFB(this.callback)
        onLCP(this.callback)
        onINP(this.callback)
    }
    unload() {
    }
}
