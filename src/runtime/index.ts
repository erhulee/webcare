import { Plugin } from "../types/plugin"
import { AnyFunc, AnyObject } from "../types/other"
import { Sender } from "src/types/sender";
import { Options } from "src/types/options";
import { GLOBAL_METHOD } from "./global";
import { generateCanvasDeviceID, generateSessionID } from "@/utils/device";
export class Monitor {
    private plugins: Plugin[] = [];
    public deviceID: string = generateCanvasDeviceID();
    public sessionID: string = generateSessionID();
    private event_bus: Map<string, AnyFunc[]> = new Map();
    // 对外隐藏
    private sender!: Sender
    private hijackCache = new Map()
    get sender_method() {
        // 如果是 beacon sender，也需要规定 method 是 post，
        return this.sender.method || "post"
    }
    /* -- 劫持原生 api 三件套*/
    hijackFn(key: string, fn: (this: AnyObject, ...args: any[]) => any, instance: Record<string, any>) {
        const origin_fn = instance[key] as AnyFunc;
        instance[key] = function (...args: any[]) {
            return fn.call(this, ...args)
        }
        this.hijackCache.set(key, {
            fn: origin_fn,
            owner: instance
        })
    }
    getHijackFn(key: string, callback: AnyFunc = () => { }) {
        const hijackItem = this.hijackCache.get(key);
        if (hijackItem == null) {
            return callback
        } else {
            return this.hijackCache.get(key).fn as AnyFunc
        }
    }
    releaseHijackFn(key: string) {
        debugger
        const { fn, owner } = this.hijackCache.get(key)
        owner[key] = fn
    }
    /* ------------------ */

    appid: string
    endpoint: string
    env: Record<string, any> = {}
    uid?: string | number
    setUID(uid: string | number) {
        this.uid = uid
    }
    constructor(options: Options) {
        this.appid = options.appid
        this.endpoint = options.endpoint;

        // 生成 session id

        // 生成 浏览器指纹

        (window as any).__SNIPER__ = this
    }
    // 调用 plugin 上向外暴露的事件
    call(eventName: GLOBAL_METHOD, ...args: any[]) {
        const target_plugins = this.plugins.filter(plugin => Boolean(plugin.globalMethod?.[eventName]));
        if (target_plugins.length == 0 || !Array.isArray(target_plugins)) {
            console.error("[webcare]: 未实现该事件")
            return null
        } else if (target_plugins.length > 1) {
            console.error("[webcare]: 有两个plugin实现该事件")
            return null
        } else {
            return target_plugins[0].globalMethod?.[eventName](...args)
        }
    }
    use(sender: Sender): void;
    use(plugins: Plugin[]): void;
    use(element: Plugin[] | Sender) {
        // 插件挂载
        if (Array.isArray(element)) {
            element.forEach(plugin => {
                // plugin 挂载到 monitor 实例上
                // plugin.monitor = this;
                this.plugins.push(plugin)

                // 读取要监听的时间
                // if (typeof plugin.events == "function") {
                //     const event_entry = plugin.events();
                //     const event_name = Object.keys(event_entry);
                //     event_name.forEach(event => {
                //         const event_callback = event_entry[event].bind(plugin)
                //         if (this.event_bus.has(event)) {
                //             (this.event_bus.get(event) as AnyFunc[]).push(event_callback)
                //         } else {
                //             this.event_bus.set(event, [event_callback])
                //         }
                //     })
                // }
            })

        } else {
            // 发送器挂载
            this.sender = element
        }
    }
    start(env: Record<string, any>) {
        if (env) this.env = env
        if (this.sender == null) {
            console.log('[sender]: 未初始化发送器')
            return
        }
        this.plugins.forEach(plugin => plugin.run())
    }
    unload() {
        this.plugins.forEach(plugin => {
            if (typeof plugin.unload == "function") {
                plugin.unload()
            }
        })
    }
    track(data: any) {
        this.sender.send(data)
    }
    send(data: any) {
        this.sender.send(data)
    }
}