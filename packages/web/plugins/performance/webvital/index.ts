
import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals';
import WebMonitor from "web/core/WebMonitor"
import { Plugin } from "share/Plugin"
import { WebVitalLogger } from "web/logger/index"

export class WebVitalsPlugin implements Plugin {
    monitor: WebMonitor
    performance: any
    constructor(monitor: WebMonitor) {
        this.monitor = monitor
        this.performance = {};
    }
    init() { }

    async run() {
        const callback = (value: any) => {
            const log = new WebVitalLogger(value);
            this.monitor.send(log);
        }
        [onCLS, onFID, onLCP, onFCP, onTTFB].forEach(method => {
            method(callback)
        })
    }
    unload() {

    }

}


