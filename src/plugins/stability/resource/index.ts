import { Monitor } from "src/runtime";
import { connect } from "src/runtime/connect";
import { AnyFunc } from "src/types/other";
import { Plugin } from "src/types/plugin";
import { isFail } from "./is";
import { createResourceErrorLogger, createResourcePerformanceLogger } from "./report";

@connect
class ResourcePlugin implements Plugin {
    monitor!: Monitor;
    listener: AnyFunc | null = null
    performanceObserver: PerformanceObserver | null = null
    run() {
        const that = this;
        if (typeof PerformanceObserver == "function") {
            this.performanceObserver = new PerformanceObserver(((list, observer) => {
                const entries = list.getEntriesByType("resource") as unknown as PerformanceResourceTiming[];

                entries.forEach((entry: PerformanceResourceTiming) => {
                    switch (entry.initiatorType) {
                        case "beacon":
                        case "fetch":
                        case "xmlhttprequest":
                            break;
                        case "script":
                        case "link":
                        case "img":
                        case "css":
                            // 通过 entry 的字段，获取文件名/文件大小/耗时等信息
                            const fileSize = entry.transferSize;
                            // duration = entry.responseEnd - entry.responseStart;
                            const duration = entry.duration;
                            const filePath = entry.name;
                            const type = entry.initiatorType;
                            if (isFail(entry)) {
                                that.monitor.send(createResourceErrorLogger({
                                    type: type,
                                    file_url: filePath
                                }))
                            } else {
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
                    }
                })
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