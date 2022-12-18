import WebMonitor from "web/WebMonitor";
import { JSErrorLogger } from "./type";

// 负责环境变量和指纹的注入
function createBaseLogger(monitor: WebMonitor) {
    const userAgent = navigator.userAgent;
    const dateTime  = new Date();
    const fingerPrint = monitor.fingerprint;
    return {
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