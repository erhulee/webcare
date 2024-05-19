import createJSErrorLogger from "@/factory/jserror";
import React, { Component, ReactNode } from "react";

type Props = React.PropsWithChildren<{}>
class WebCareBoundary extends Component<Props> {
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // 错误上报
        const instance = (window as any).__SNIPER__;
        const logger = createJSErrorLogger({
            stack: error.stack!,
            message: error.message
        })
        instance.send(logger)
    }
    render(): ReactNode {
        const { children } = this.props
        return children
    }
}

export default WebCareBoundary