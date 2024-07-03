import createPVLogger from "@/factory/pv";
import { Monitor } from "@/runtime";
import { connect } from "@/runtime/connect";
import { Plugin } from "@/types/plugin";

@connect
export class PVPlugin implements Plugin {
    monitor!: Monitor;
    pre_pathname: string = ""
    run() {
        const monitor = this.monitor;
        window.addEventListener("hashchange", (e) => {
            const current_pathname = location.pathname
            const pre_pathname = this.pre_pathname
            if (pre_pathname == current_pathname) {
                // skip
            } else {
                const { href: url } = location;
                const logger = createPVLogger({ url })
                this.monitor.send(logger);
            }
        })
        window.addEventListener("popstate", (e) => {
            const current_pathname = location.pathname
            const pre_pathname = this.pre_pathname
            if (pre_pathname == current_pathname) {
                // skip
            } else {
                const { href: url } = location;
                const logger = createPVLogger({ url })
                this.monitor.send(logger);
            }
        })
        //
        /**
         * 参数一般是 [state, title, url]，虽然我没看懂有啥用
         * - state：一个与添加的记录相关联的状态对象，主要用于popstate事件。该事件触发时，该对象会传入回调函数。也就是说，浏览器会将这个对象序列化以后保留在本地，重新载入这个页面的时候，可以拿到这个对象。如果不需要这个对象，此处可以填null。
         * - title：新页面的标题。但是，现在所有浏览器都忽视这个参数，所以这里可以填空字符串。
         * - url：新的网址，必须与当前页面处在同一个域。浏览器的地址栏将显示这个网址。
         */
        this.monitor.hijackFn("pushState", (...args) => {
            const current_pathname = location.pathname
            const pre_pathname = this.pre_pathname
            if (pre_pathname == current_pathname) {
                // skip
            } else {
                const { href: url } = location;
                const logger = createPVLogger({ url })
                this.monitor.send(logger);
            }
            const native_pushState = monitor.getHijackFn("pushState")
            native_pushState.call(history, ...args)
        }, window.history)
        this.monitor.hijackFn("replaceState", (...args) => {
            const current_pathname = location.pathname
            const pre_pathname = this.pre_pathname
            if (pre_pathname == current_pathname) {
                // skip
            } else {
                const { href: url } = location;
                const logger = createPVLogger({ url })
                this.monitor.send(logger);
            }
            const native_replaceState = monitor.getHijackFn("replaceState")
            native_replaceState.call(history, ...args)
        }, window.history)
    }
    unload() {
        this.monitor.releaseHijackFn("pushState")
        this.monitor.releaseHijackFn("replaceState")
    }
}

