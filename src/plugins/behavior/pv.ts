import { Monitor } from "@/runtime";
import { connect } from "@/runtime/connect";
import { Plugin } from "@/types/plugin";

@connect
export class PVPlugin implements Plugin {
    monitor!: Monitor;
    run() {
        window.addEventListener("hashchange", (e) => {
            console.log("hashcahnge")
        })
        window.addEventListener("popstate", (e) => {
            console.log("popstate")
        })

        const monitor = this.monitor;
        this.monitor.hijackFn("pushState", (...args) => {
            console.log("pushState")
            const native_pushState = monitor.getHijackFn("pushState")
            native_pushState.call(history, ...args)
        }, window)
        this.monitor.hijackFn("replaceState", (...args) => {
            console.log("replaceState")
            const native_replaceState = monitor.getHijackFn("replaceState")
            native_replaceState.call(history, ...args)
        }, window)
    }
    unload() {
        this.monitor.releaseHijackFn("pushState")
        this.monitor.releaseHijackFn("replaceState")
    }
}

