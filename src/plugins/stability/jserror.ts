import { Monitor } from "src/runtime";
import { Plugin } from "../../types/plugin";
import { connect } from "src/runtime/connect";
import { LimitQueue } from "src/utils/LimitQueue";
import createJSErrorLogger from "src/factory/jserror";
import createPromiseLogger from "src/factory/unhandled_promise";

@connect
class JsErrorPlugin implements Plugin {
    monitor!: Monitor;
    error_listener: any;
    promise_listener: any;

    run() {
        this.error_listener = (e: ErrorEvent) => {
            const { stack, message } = e.error
            this.monitor.send(createJSErrorLogger({ stack, message }))
        }
        this.promise_listener = (e: ErrorEvent) => {
            this.monitor.send(createPromiseLogger({}))
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

export default JsErrorPlugin