
interface Window {
    __SNIPER__: WebMonitor;
    WebMonitor: WebMonitor
    _fetch: (input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>;
}

declare var window: Window;


