import { Monitor } from "@/runtime";
import { Plugin } from "@/types/plugin";
import { connect } from "@/runtime/connect";
import createJSErrorLogger from "@/factory/jserror";
import createPromiseLogger from "@/factory/unhandled_promise";
import { GLOBAL_METHOD } from "@/runtime/global";
import { set } from "lodash-es";

@connect
class JsErrorPlugin implements Plugin {
    monitor!: Monitor;
    error_listener: any;
    promise_listener: any;
    run() {
        this.error_listener = (e: ErrorEvent) => {
            const { stack, message } = e.error
            const rrweb = this.monitor.call(GLOBAL_METHOD.GET_RRWEB_DATA)
            const logger = createJSErrorLogger({ stack, message });
            if (rrweb != null) {
                set(logger, "record", rrweb)
            }
            this.monitor.send(logger)
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

}

export default JsErrorPlugin