import { Monitor } from "./src/runtime";

interface Window {
    __SNIPER__: Monitor;
    WebMonitor: Monitor
    _fetch: (input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>;
}

declare var window: Window;


