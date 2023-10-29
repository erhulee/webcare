import { Monitor } from "src/runtime";
import { InjectEnvironmentInfo } from "./base";

export default function createHTTPErrorLogger(params: {
    method?: "get" | "post" | "delete" | "put"
    url: string,
    query?: string,
    body?: Record<string, any>
    status: number;
    status_text: string
}, monitor?: Monitor) {
    const logger = {
        category: "stability",
        type: "http",
        ...params
    }
    InjectEnvironmentInfo(logger)
    return logger
}