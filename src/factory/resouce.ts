import { Monitor } from "src/runtime";
import { InjectEnvironmentInfo } from "./base";

function createResourceErrorLogger(params: {
    file_url: string
}, monitor?: Monitor) {
    const logger = {
        category: "stability",
        type: "resource",
        detail: params
    }
    InjectEnvironmentInfo(logger)
    return logger
}

export default createResourceErrorLogger