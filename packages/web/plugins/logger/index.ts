import WebMonitor from "web/WebMonitor";
import { HTTPErrorLogger, JSErrorLogger, LongTaskLogger, ResourceLogger, ResourceType } from "./type";

// 负责环境变量和指纹的注入
function createBaseLogger(monitor: WebMonitor) {
    const userAgent = navigator.userAgent;
    const dateTime  = new Date();
    const fingerPrint = monitor.fingerprint;
    const path = window.location.href;
    return {
        path,
        userAgent,
        dateTime,
        fingerPrint
    }
}


export function createJSErrorLogger (monitor: WebMonitor, message:string, stack: any) {
    const env = createBaseLogger(monitor);
    const logger = new JSErrorLogger(message, stack);
    return {
        ...env,
        ...logger
    }
}

export function createPromiseErrorLogger(monitor: WebMonitor, message:string, stack: any) {
    const env = createBaseLogger(monitor);
    const logger = new JSErrorLogger(message, stack);
    return {
        ...env,
        ...logger
    }
}


export function createHTTPLogger(monitor: WebMonitor, response: XMLHttpRequest | Response, type:"XHR"|"Fetch") {
    const env = createBaseLogger(monitor);
    let status = response.status;
    let url = "";
    if(type == "XHR"){
        const xhrResponse = response as XMLHttpRequest;
        url     = xhrResponse.responseURL;
      }else{
        const fetchResponse = response as Response;
        url     = fetchResponse.url;
      }
    return {
        ...env,
        ...new HTTPErrorLogger(status, url)
    }
}

export function createResourceLogger(monitor: WebMonitor, type: ResourceType, url: string) {
    const env = createBaseLogger(monitor);
    return {
        ...env,
        ...new ResourceLogger(type, url)
    }
}

export function createLongTaskLogger(monitor: WebMonitor, entry:PerformanceEntry) {
    const env = createBaseLogger(monitor);
    return {
        ...env,
        ...new LongTaskLogger(entry.startTime, entry.duration, entry.name, entry.entryType)
    }
}