import { Monitor } from "./runtime";

declare global {
    interface Window {
        __SNIPER__: Monitor;
        WebMonitor: Monitor
        _fetch: (input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>;
    }
}

