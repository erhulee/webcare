import createFPLogger from "@/factory/fp";
import createTimingLogger from "@/factory/timing";
import { Monitor } from "@/runtime"
import { connect } from "@/runtime/connect";
import { Plugin } from "@/types/plugin"
/**
 * @link https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceNavigationTiming
 *  // 网页重定向的耗时:redirectEnd - redirectStart
    // 检查本地缓存的耗时: domainLookupStart - fetchStart
    // DNS查询的耗时:domainLookupEnd - domainLookupStart
    // TCP连接的耗时:connectEnd - connectStart
    // 从客户端发起请求到接收到响应的时间 / TTFB:responseStart - fetchStart
    // 首次渲染时间/白屏时间:responseStart - pnt.startTime
    // 下载服务端返回数据的时间:responseEnd - responseStart
    // request请求耗时:responseEnd - requestStart
    // 解析dom树耗时:domComplete - domInteractive
    // dom加载完成的时间:domContentLoadedEventEnd
    // 页面load的总耗时:duration
 */
@connect
export class TimingPlugin implements Plugin {
    monitor!: Monitor;
    run() {
        const entry = performance?.getEntriesByType?.("navigation")
        if (entry && entry[0]) {
            const timing = entry[0]
            const dns = timing.domainLookupEnd - timing.domainLookupStart;
            const tcp = timing.connectEnd - timing.connectStart;
            const ttfb = timing.responseStart - timing.fetchStart;
            const request = timing.responseEnd - timing.requestStart;
            const dom = timing.domComplete - timing.domInteractive;
            const duration = timing.duration
            this.monitor.send(createTimingLogger({
                metric: {
                    dns,
                    tcp,
                    ttfb,
                    request,
                    dom,
                    duration
                },
                domainLookupEnd: timing.domainLookupEnd,
                domainLookupStart: timing.domainLookupStart,
                connectEnd: timing.connectEnd,
                connectStart: timing.connectStart,
                responseStart: timing.responseStart,
                responseEnd: timing.responseEnd,
                fetchStart: timing.fetchStart,
                requestStart: timing.requestStart,
                domComplete: timing.domComplete,
                domInteractive: timing.domInteractive,
                loadEventEnd: timing.loadEventEnd,
                redirectStart: timing.requestStart,
                duration: timing.duration
            }))
        } else {
            const timing = performance.timing
            const dns = timing.domainLookupEnd - timing.domainLookupStart;
            const tcp = timing.connectEnd - timing.connectStart;
            const ttfb = timing.responseStart - timing.fetchStart;
            const request = timing.responseEnd - timing.requestStart;
            const dom = timing.domComplete - timing.domInteractive
            const duration = timing.loadEventEnd - timing.redirectStart
            this.monitor.send(createTimingLogger({
                metric: {
                    dns,
                    tcp,
                    ttfb,
                    request,
                    dom,
                    duration
                },
                domainLookupEnd: timing.domainLookupEnd,
                domainLookupStart: timing.domainLookupStart,
                connectEnd: timing.connectEnd,
                connectStart: timing.connectStart,
                responseStart: timing.responseStart,
                responseEnd: timing.responseEnd,
                fetchStart: timing.fetchStart,
                requestStart: timing.requestStart,
                domComplete: timing.domComplete,
                domInteractive: timing.domInteractive,
                loadEventEnd: timing.loadEventEnd,
                redirectStart: timing.requestStart,
                duration: duration
            }))
        }
    }
}