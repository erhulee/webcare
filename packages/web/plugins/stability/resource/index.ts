
import WebMonitor from "web/WebMonitor";
import { Plugin } from "share/Plugin"
import { ResourceType } from "../../../logger/type";
import { ResourceErrorLogger, ResourcePerformanceLogger } from "web/logger";
function analyzeLinkType(attribute: { rel?: string, type?: string, href?: string, as?: string }) {
    function isCSS(): boolean {
        const { rel, type, href, as } = attribute;
        return Boolean(rel == "stylesheet" || type == "text/css" || href?.includes(".css") || as == "style")
    }
    // function isFont(attribute: { rel?: string, type?: string, href?: string }): boolean {
    //     const fontFileExt = ["ttf", "ttc", "eot", "otf", "woff", "svg"]
    //     const { rel, type, href } = attribute;
    //     return Boolean(rel == "stylesheet" || type == "text/css" || href?.includes(".css"))
    // }

    function isImage(): boolean {
        const { rel, type, href, as } = attribute;
        const extensions = href?.split(".").pop() || "";
        const imageFileExtensions = ["jpg", "jpeg", "png", "gif", "svg", "bmp", "ico", "webp"]
        return Boolean(rel == "icon" || rel == "app-touch-icon" || rel == "mask-icon" ||
            type == "image/png" || imageFileExtensions.includes(extensions) || as == "image")
    }

    if (isCSS()) return ResourceType.CSS;
    if (isImage()) return ResourceType.Image;
    return ResourceType.Unknown
}

const tagName2ResourceType: { [key: string]: ResourceType } = {
    link: ResourceType.CSS,
    script: ResourceType.Javascript,
    img: ResourceType.Image,
    video: ResourceType.Video,
    audio: ResourceType.Audio,
    unknown: ResourceType.Unknown
}
export class ResourcePlugin implements Plugin {
    monitor: WebMonitor
    listener: ((e: any) => void) | null = null
    performanceObserver: PerformanceObserver | null = null
    constructor(monitor: WebMonitor) {
        this.monitor = monitor;
    }
    init() {

    }
    run() {
        const that = this;
        if (typeof PerformanceObserver == "function") {
            this.performanceObserver = new PerformanceObserver(((list, observer) => {
                const entries = list.getEntriesByType("resource") as unknown as PerformanceResourceTiming[];
                entries.forEach((entry) => {
                    if (entry.initiatorType == "xmlhttprequest") return;
                    const isFail = entry.transferSize == 0;
                    let logger = null;
                    const url = entry.name;
                    const type = entry.initiatorType;
                    if (isFail) {
                        logger = new ResourceErrorLogger(tagName2ResourceType[type], url);
                    } else {
                        // 如果成功的 -> 上报duration
                        const duration = entry.duration
                        logger = new ResourcePerformanceLogger(tagName2ResourceType[type], url, duration);
                    }
                    that.monitor.send(logger)
                })
            }))
            this.performanceObserver.observe({
                entryTypes: ["resource"],
            });
        } else {
            // 降级 window.onerror
            const listener = function (e: ErrorEvent) {
                const target: any = e.target;
                // 如果是 JS 错误 -> 跳过
                if (target == window) return
                const nodeName: string = target.nodeName;
                let logger = null;
                if (nodeName == "LINK") {
                    // link 可以导入 css / 字体文件 / icon
                    // link 可以做 预加载 / 预链接
                    // 如果有 rel 就解析 rel， 没有就解析 href 的文件后缀
                    const attributes = buildAttributesObject(target.attributes, ["rel", "type", "href", "as"] as const);
                    const type = analyzeLinkType(attributes);
                    const url = attributes.href;
                    logger = new ResourceErrorLogger(tagName2ResourceType[type], url);
                } else {
                    const tag = nodeName.toLowerCase();
                    const url = target.src;
                    logger = new ResourceErrorLogger(tagName2ResourceType[tag], url);
                }

            }
            this.listener = listener;
            window.addEventListener("error", listener, true)
        }

    };
    unload() {
        if (this.listener) {
            window.removeEventListener("error", this.listener)
        }
    };
}
