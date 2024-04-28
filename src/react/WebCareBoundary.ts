import createJSErrorLogger from "@/factory/jserror";
import { Component } from "react";

class WebCareBoundary extends Component {
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // 错误上报
        const instance = (window as any).__SNIPER__;
        const logger = createJSErrorLogger({
            stack: error.stack!,
            message: error.message
        })
        instance.send(logger)
    }
}

export default WebCareBoundary