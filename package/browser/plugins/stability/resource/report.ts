import { InjectEnvironmentInfo } from "@/factory/base";

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
