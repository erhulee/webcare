
import { Monitor } from "src/runtime";
import { Plugin } from "../../types/plugin";
import { connect } from "src/runtime/connect";
import buildQuery from "src/utils/buildQuery";
import { get, set } from "lodash-es";
import { createHTTPErrorLogger, createHTTPSlowLogger } from "@/factory/http";

function isStatusOk(status: number) {
    return status >= 200 && status < 300
}

function createXHRContext() {
    return {
        method: "",
        url: "",
        body: "",
        done: false,
        tick: Date.now()
    }
}

function privacyFilter(exclude_rule: ExcludeRule | undefined, url: string) {
    if (exclude_rule) {
        if (typeof exclude_rule == "function") {
            if (exclude_rule(url)) return
        }
        if (typeof exclude_rule == "object" && Array.isArray(exclude_rule)) {
            exclude_rule.some((rule) => {
                if (rule instanceof RegExp) {
                    return rule.test(url)
                }
                if (typeof rule == "string") {
                    return rule == url
                }
            })
        }
    }
    return false
}
const XHR_CONTEXT_PROPERTY = "__webcare_xhr_context__"

type ExcludeRule = Array<{
    path: string | RegExp
}> | ((path: string) => boolean)
@connect
export default class HTTPPlugin implements Plugin {
    monitor!: Monitor;
    nativeXHRSend?: any
    nativeFetch?: any
    slow_request?: number
    exclude_rule?: ExcludeRule
    constructor(options?: {
        /**
         * 慢请求预设，单位(ms)
         */
        slow_request?: number
        /**
         * 隐私诉求
         */
        exclude?: ExcludeRule

    }) {
        this.slow_request = options?.slow_request
        this.exclude_rule = options?.exclude
    }
    run() {
        /* xhr 劫持 */
        // TODO: 目前有个缺陷, 如果 open 阶段就失败了，会监听失败(502)
        const monitor = this.monitor;
        const plugin = this;
        const open_callback = function (this: XMLHttpRequest, ...args: any[]) {
            const native_send = that.monitor.getHijackFn("open");
            const ctx = createXHRContext();
            ctx.method = args[0];
            ctx.url = args[1];
            const callback: (this: any) => void = function () {
                const url = this.responseURL;
                // const query = buildQuery(url);
                if (ctx.url == monitor.endpoint || ctx.done) return;
                if (this.readyState == 4 && !isStatusOk(this.status)) {
                    // 报错
                    const status = this.status;
                    const status_text = this.statusText;
                    const logger = createHTTPErrorLogger({
                        //TODO 留个类型TODO
                        method: ctx.method as any,
                        url: ctx.url,
                        query: "",
                        body: ctx.body,
                        status: status,
                        status_text: status_text
                    })
                    // const logger = new HTTPErrorLogger(code, url, HttpMethods.POST)
                    monitor.send(logger)
                    ctx.done = true
                }
            }
            set(this, XHR_CONTEXT_PROPERTY, ctx)
            this.addEventListener("readystatechange", callback)
            native_send.call(this, ...args)
        }
        const send_callback = function (this: XMLHttpRequest, ...args: any[]) {
            const native_send = that.monitor.getHijackFn("send");
            const body = args[0];
            const ctx = get(this, XHR_CONTEXT_PROPERTY) as unknown as ReturnType<typeof createXHRContext>;
            const callback: (this: any) => void = function () {
                const url = this.responseURL as string;
                const request_time = Date.now() - ctx.tick;
                const query = buildQuery(url);
                if (ctx.url == monitor.endpoint || ctx.done) return;
                if (privacyFilter(plugin.exclude_rule, url)) return

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
                } else if (plugin.slow_request && request_time > plugin.slow_request) {
                    const logger = createHTTPSlowLogger({
                        url: url,
                        query: query,
                        body: body,
                        duration: request_time
                    })
                    monitor.send(logger)
                }
            }
            this.addEventListener("readystatechange", callback)
            native_send.call(this, ...args)
        }
        this.monitor.hijackFn("open", open_callback, XMLHttpRequest.prototype)
        this.monitor.hijackFn("send", send_callback, XMLHttpRequest.prototype)


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
                    if (privacyFilter(plugin.exclude_rule, resource)) return null;
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
                    if (reason) {
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
                    } else {
                        return Promise.reject("webcare inner error")
                    }
                })
            return promise
        }, window)
    }
    unload() {
        this.monitor.releaseHijackFn("send")
        this.monitor.releaseHijackFn("fetch")
    }
}