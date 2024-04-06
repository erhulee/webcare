type AnyFunc = (...args: any[]) => any;
type AnyObject = any;
type HTTPMethod = "get" | "post";

interface Plugin {
    monitor: Monitor;
    run: () => void;
    unload: () => void;
    events?: () => Record<string, AnyFunc>;
}

interface Environment {
    timestamp: number;
    pathname: string;
    query: string;
    ua: string;
}
interface SniperLog {
    env?: Environment;
    extra?: {};
}

interface Sender {
    endpoint: string;
    method?: HTTPMethod;
    send: (log: SniperLog) => void;
}

type Options = {
    appid: string;
    endpoint: string;
};

declare class Monitor {
    private plugins;
    private event_bus;
    private sender;
    private hijackCache;
    get sender_method(): HTTPMethod;
    hijackFn(key: string, fn: (this: AnyObject, ...args: any[]) => any, instance: Record<string, any>): void;
    getHijackFn(key: string, callback?: AnyFunc): AnyFunc;
    releaseHijackFn(key: string): void;
    appid: string;
    endpoint: string;
    env: Record<string, any>;
    constructor(options: Options);
    call(eventName: string, ...args: any[]): void;
    use(sender: Sender): void;
    use(plugins: Plugin[]): void;
    start(env: Record<string, any>): void;
    unload(): void;
    track(data: any): void;
    send(data: any): void;
}

declare class LimitQueue<T> {
    private size;
    private data;
    constructor(size: number);
    add(data: T): void;
    get value(): T[];
}

declare class JsErrorPlugin implements Plugin {
    monitor: Monitor;
    error_listener: any;
    promise_listener: any;
    rrwebQueue: LimitQueue<any>;
    run(): void;
    unload(): void;
    events(): {
        rrweb: (event: any) => void;
    };
    constructor(rrweb_size?: number);
}

declare class HTTPPlugin implements Plugin {
    monitor: Monitor;
    nativeXHRSend?: any;
    nativeFetch?: any;
    constructor();
    run(): void;
    unload(): void;
}

declare class ResourcePlugin implements Plugin {
    monitor: Monitor;
    listener: AnyFunc | null;
    performanceObserver: PerformanceObserver | null;
    run(): void;
    unload(): void;
}

declare class XHRSender implements Sender {
    monitor: Monitor;
    method: HTTPMethod;
    get endpoint(): string;
    constructor(method: HTTPMethod);
    send(log: SniperLog): void;
}

export { HTTPPlugin, JsErrorPlugin, Monitor, ResourcePlugin, XHRSender };
