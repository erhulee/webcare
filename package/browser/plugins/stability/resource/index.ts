import { Monitor } from "@/runtime";
import { connect } from "@/runtime/connect";
import { AnyFunc } from "@/types/other";
import { GLOBAL_EVENT, Plugin } from "@/types/plugin";
import { isCORS, isFail } from "./is";
import { createHTTPPerformanceLogger, createResourceErrorLogger, createResourcePerformanceLogger } from "./report";
import { createHTTPErrorLogger } from "@/factory/http";

@connect
class ResourcePlugin implements Plugin {
    monitor!: Monitor;
    listener: AnyFunc | null = null
    performanceObserver: PerformanceObserver | null = null
    run() {
        const that = this;
        if (typeof PerformanceObserver == "function") {
            /**
             * 发现直接用 PerformanceObserver 是拿不到代码运行前发生的资源加载，除非把代码写死在 index.html 中
             * 不然会存在监控异常的问题
             *
             * 所以这里 performance.getEntriesByType 先捞一批
             */

            const walk = (entry: PerformanceResourceTiming) => {
                switch (entry.initiatorType) {
                    case "beacon":
                        break;
                    case "fetch":
                        console.log("[debug] fetch performance:", entry)
                    case "xmlhttprequest":
                        console.log("[debug] http performance:", entry)
                        // const redirect = entry.redirectEnd - entry.redirectStart;
                        // const cache = entry.domainLookupStart - entry.fetchStart;
                        // const dns = entry.domainLookupEnd - entry.domainLookupStart;
                        // const tcp = entry.connectEnd - entry.connectStart;
                        // const transferTime = entry.responseEnd - entry.responseStart;
                        // const transferSize = entry.transferSize;
                        this.monitor.trigger(GLOBAL_EVENT.NET_PERFORMANCE, entry)
                        break;
                    case "script":
                    case "link":
                    case "img":
                    case "css":
                        // 通过 entry 的字段，获取文件名/文件大小/耗时等信息
                        const fileSize = entry.encodedBodySize;
                        // duration = entry.responseEnd - entry.responseStart;
                        const duration = entry.duration;
                        const filePath = entry.name;
                        const type = entry.initiatorType;
                        if (isFail(entry)) {
                            that.monitor.send(createResourceErrorLogger({
                                type: type,
                                file_url: filePath
                            }))
                        } else if (!isCORS(entry)) {
                            that.monitor.send(
                                createResourcePerformanceLogger({
                                    type: type,
                                    file_url: filePath,
                                    duration: duration,
                                    file_size: fileSize
                                })
                            )
                        }
                    default:
                        console.log("from resource plugin:", entry)
                }
            }
            const preEntries = performance.getEntriesByType('resource');
            preEntries.forEach(walk)
            this.performanceObserver = new PerformanceObserver(((list, observer) => {
                const entries = list.getEntriesByType("resource") as unknown as PerformanceResourceTiming[];
                entries.forEach(walk)
            }))
            this.performanceObserver.observe({
                entryTypes: ["resource"],
            });
        } else {
            // this.listener = function (e: ErrorEvent) {
            //     console.log("from resource plugin:", e)
            //     const target: any = e.target;
            //     // 如果是 JS 错误 -> 跳过
            //     if (target == window) return
            //     const nodeName: string = target.nodeName;
            //     if (nodeName == "LINK") {
            //         // link 可以导入 css / 字体文件 / icon
            //         // link 可以做 预加载 / 预链接
            //         // 如果有 rel 就解析 rel， 没有就解析 href 的文件后缀
            //         // const attributes = buildAttributesObject(target.attributes, ["rel", "type", "href", "as"] as const);
            //         // const type = analyzeLinkType(attributes);
            //         // const url = aattributes.href;
            //         // logger = new ResourceErrorLogger(tagName2ResourceType[type], url);
            //         that.monitor.send(createResourceErrorLogger({
            //             file_url: "link"
            //         }))
            //     }
            // }
            // window.addEventListener("error", this.listener, true)
        }
    }
    unload() {
        this.performanceObserver && this.performanceObserver.disconnect();
        this.listener && window.removeEventListener("error", this.listener)
    }

}

export default ResourcePlugin