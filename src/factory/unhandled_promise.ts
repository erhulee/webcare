import { Monitor } from "src/runtime"
import { InjectEnvironmentInfo } from "./base"

export default function createPromiseLogger(params: {}, monitor?: Monitor) {
    const logger = {
        category: "stability",
        type: "unhandled_promise",
        ...params
    }
    InjectEnvironmentInfo(logger)
    return logger
}



