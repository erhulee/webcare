import React, { PureComponent } from "react";
import { WebMonitor } from "web/core";

export const Context = React.createContext<WebMonitor | null>(null);
class ErrorBound extends PureComponent {
  static contextType = Context;
  constructor(props: any) {
    super(props);
  }
  componentDidCatch(error: Error) {
    console.log("react error");
    const monitor = this.context as WebMonitor;
    if (monitor == null) return;
    monitor.trackJSError(error);
  }
  render() {
    return (this.props as any).children;
  }
}
export default function SniperOuter(
  props: React.PropsWithChildren<{ monitor: WebMonitor }>
) {
  return (
    <Context.Provider value={props.monitor}>
      <ErrorBound>{props.children}</ErrorBound>;
    </Context.Provider>
  );
}
