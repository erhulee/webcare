import WebMonitor from "web/WebMonitor";
import { CrashLogger, LongTaskLogger, ResourceLogger, ResourceType, WebVital, WebVitalsLogger } from "./type";

// 负责环境变量和指纹的注入
function createBaseLogger(monitor: WebMonitor) {
    const userAgent = navigator.userAgent;
    const dateTime = new Date();
    const fingerPrint = monitor.fingerprint;
    const path = window.location.href;
    return {
        path,
        userAgent,
        dateTime,
        fingerPrint
    }
}


export function createResourceLogger(monitor: WebMonitor, type: ResourceType, url: string, duration?: number) {
    const env = createBaseLogger(monitor);
    if (!Boolean(type) || !Boolean(url)) return null
    // 有 duration -> 资源加载成功
    // 没有 duration -> 资源加载失败
    return {
        ...env,
        ...new ResourceLogger(type, url, duration)
    }
}

export function createLongTaskLogger(monitor: WebMonitor, entry: PerformanceEntry) {
    const env = createBaseLogger(monitor);
    return {
        ...env,
        ...new LongTaskLogger(entry.startTime, entry.duration, entry.name, entry.entryType)
    }
}

export function createWebVitalLogger(monitor: WebMonitor, webvital: WebVital) {
    const env = createBaseLogger(monitor);
    return {
        ...env,
        ...new WebVitalsLogger(),
        ...webvital
    }
}

export function createCrashLogger(monitor: WebMonitor) {
    const env = createBaseLogger(monitor);
    return {
        ...env,
        ...new CrashLogger()
    }
}

export function createPVLogger(monitor: WebMonitor, pathname: string, search: string = "") {
    const env = createBaseLogger(monitor);
    return {
        ...env,
        category: "Behavior",
        type: "PV",
        pathname,
        search
    }
}

export function createBounceRateLogger(monitor: WebMonitor, pathname: string, search: string = "") {
    const env = createBaseLogger(monitor);
    return {
        ...env,
        category: "Behavior",
        type: "BounceRate",
        pathname,
        search
    }
}