import { Plugin } from "../types/plugin";
import { AnyFunc, AnyObject } from "../types/other";
import { Sender } from "src/types/sender";
export declare class Monitor {
    private plugins;
    private event_bus;
    private sender;
    private hijackCache;
    get sender_method(): import("../types/other").HTTPMethod;
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
