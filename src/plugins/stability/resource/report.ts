import { InjectEnvironmentInfo } from "@/factory/base";
import { Monitor } from "src/runtime";

export function createResourceErrorLogger(params: {
    file_url: string
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
    file_size: number
}) {
    const logger = {
        category: "performance",
        type: "resource",
        detail: params
    }
    InjectEnvironmentInfo(logger)
    return logger
}
