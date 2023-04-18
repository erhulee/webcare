import WebMonitor from "web/core/WebMonitor"
import { Plugin } from "@sniper/core"
import { work_source } from "./webwork"
import { CrashLogger } from "web/logger"

export class CrashPlugin implements Plugin {
    monitor: WebMonitor
    worker: Worker | null
    constructor(instance: WebMonitor) {
        this.monitor = instance
        this.worker = null
    }
    init() {
        [].unshift
    }
    run() {
        const content = new Blob([work_source]);
        const worker = new Worker(URL.createObjectURL(content));
        this.worker = worker;
        worker.postMessage({
            type: "init",
            endpoint: this.monitor.endpoint,
            method: this.monitor.method,
            logger: new CrashLogger(),
            appid: this.monitor.appid
        })

        worker.addEventListener("message", (message) => {
            const data = message.data;
            worker.postMessage({
                type: "sync",
                data,
                rrwebStack: this.monitor.rrwebStack
            })
        })
    }
    unload() {
        if (this.worker) {
            this.worker.terminate()
        }
    }
}

