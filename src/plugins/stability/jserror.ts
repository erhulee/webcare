import { Monitor } from "src/runtime";
import { AnyFunc } from "src/types/other";
import { Plugin } from "../../types/plugin";
import { connect } from "src/runtime/connect";
import { LimitQueue } from "src/utils/LimitQueue";

@connect
class JsErrorPlugin implements Plugin {
    monitor!: Monitor;
    error_listener: any;
    promise_listener: any;

    run() {
        this.error_listener = (e: ErrorEvent) => {
            console.log("js error")
            // const log = new JSErrorLogger(e.message, e.error?.stack, this.rrwebQueue.value)
            // this.monitor.send(log)
        }
        this.promise_listener = (e: ErrorEvent) => {
            console.log("js promise error")
            // const log = new PromiseErrorLogger(e.message, e.error?.stack, this.rrwebQueue.value)
            // this.monitor.send(log)
        }

        window.addEventListener("error", this.error_listener)
        window.addEventListener("unhandledrejection", this.promise_listener)

    }
    unload() {
        window.removeEventListener("error", this.error_listener)
        window.removeEventListener("unhandledrejection", this.promise_listener)
    }
    events() {
        return {
            rrweb: (event: any) => {
                this.rrwebQueue.add(event)
            }
        }
    }
    rrwebQueue: LimitQueue<any>
    constructor(rrweb_size: number = 20) {
        this.rrwebQueue = new LimitQueue<any>(rrweb_size)
    }



}