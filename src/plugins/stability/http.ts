
import { Monitor } from "src/runtime";
import { Plugin } from "../../types/plugin";
import { connect } from "src/runtime/connect";
import buildQuery from "src/utils/buildQuery";
import createHTTPErrorLogger from "src/factory/http";

function isStatusOk(status: number) {
    return !(status >= 400 && status < 600)
}

@connect
export default class HTTPPlugin implements Plugin {
    monitor!: Monitor;
    nativeXHRSend?: any
    nativeFetch?: any
    constructor() {
    }
    run() {
        /* xhr 劫持 */
        // TODO: 目前有个缺陷, 如果 open 阶段就失败了，会监听失败(502)
        /**
         *  body 在 send 方法
         *  method 在 open 方法
         *  家人们谁懂 ！！，但是大部分的请求 open 和 send 是一起发起的，感觉是不是可以合并 ~
         * 
        */
        // this.monitor.hijackFn("open", function (...args: any[]) {
        //     const native_send = that.monitor.getHijackFn("open");
        //     const body = args[0];
        //     console.log("open args:", args)
        //     const callback: (this: any) => void = function () {
        //         console.log("callback", this)
        //         const url = this.responseURL;
        //         const query = buildQuery(url);
        //         if (this.readyState == 4 && !isStatusOk(this.status)) {
        //             // 报错
        //             const status = this.status;
        //             const status_text = this.statusText;
        //             // const logger = createHTTPErrorLogger({

        //             // })
        //             // const logger = new HTTPErrorLogger(code, url, HttpMethods.POST)
        //             // instance.monitor.send(logger)
        //         }
        //     }
        //     this.addEventListener("readystatechange", callback)
        //     native_send.call(this, ...args)
        // }, XMLHttpRequest.prototype)
        const monitor = this.monitor;
        this.monitor.hijackFn("send", function (...args: any[]) {
            const native_send = that.monitor.getHijackFn("send");
            const body = args[0];
            const callback: (this: any) => void = function () {
                const url = this.responseURL;
                const query = buildQuery(url);
                if (this.readyState == 4 && !isStatusOk(this.status)) {
                    // 报错
                    const status = this.status;
                    const status_text = this.statusText;
                    const logger = createHTTPErrorLogger({
                        url: url,
                        query: query,
                        body: body,
                        status: status,
                        status_text
                    })
                    monitor.send(logger)
                }
            }
            this.addEventListener("readystatechange", callback)
            native_send.call(this, ...args)
        }, XMLHttpRequest.prototype)


        // /*  fetch 劫持 */
        if (!window.fetch) return;
        const that = this;
        this.monitor.hijackFn("fetch", function (...args: any[]) {
            const native_fetch = that.monitor.getHijackFn("fetch");
            const promise = native_fetch(...args);
            const [resource, options = {}] = args
            const {
                method = "GET",
                body = {}
            } = options
            const query = buildQuery(resource);
            promise
                .then(async (response: Response) => {
                    if (!isStatusOk(response.status)) {
                        const { status, statusText } = response;

                        const logger = createHTTPErrorLogger({
                            method,
                            url: resource,
                            query,
                            status,
                            status_text: statusText,
                            body: body
                        })
                        monitor.send(logger)
                    }
                    return response
                }).catch((reason: Response) => {
                    const logger = createHTTPErrorLogger({
                        method,
                        url: resource,
                        query,
                        status: -1,
                        status_text: "unknown",
                        body
                    })
                    monitor.send(logger)
                    return Promise.reject(reason)
                })
            return promise
        }, window)
    }
    unload() {
        this.monitor.releaseHijackFn("send")
        this.monitor.releaseHijackFn("fetch")
    }
}