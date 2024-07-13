import { InjectEnvironmentInfo } from "@/factory/base";
import { LoggerCategory, LoggerType } from "@/factory/constant";

export function createResourceErrorLogger(params: {
    file_url: string,
    type: string,
}) {
    const logger = {
        category: "stability",
        type: "resource",
        detail: params
    }
    InjectEnvironmentInfo(logger)
    return logger
}

export function createResourcePerformanceLogger(params: {
    file_url: string,
    duration: number,
    file_size: number,
    type: string,
}) {
    const logger = {
        category: "performance",
        type: "resource",
        detail: params
    }
    InjectEnvironmentInfo(logger)
    return logger
}


export function createHTTPPerformanceLogger(params: {
    url: string,
    body: any,
    method: string,
    connectEnd: number;
    connectStart: number;
    decodedBodySize: number;
    domainLookupEnd: number;
    domainLookupStart: number;
    encodedBodySize: number;
    fetchStart: number;
    redirectEnd: number;
    redirectStart: number;
    requestStart: number;
    responseEnd: number;
    responseStart: number;
    secureConnectionStart: number;
    transferSize: number;
}) {
    const logger = {
        category: LoggerCategory.Performance,
        type: LoggerType.HTTP,
        detail: params
    }
    InjectEnvironmentInfo(logger)
    return logger
}