import { Plugin } from "../types/plugin"
import { AnyFunc } from "../types/other"
export class Monitor {
    private plugins: Plugin[] = [];
    private event_bus: Map<string, AnyFunc[]> = new Map();

    appid: string
    endpoint: string
    sender!: Sender
    env: Record<string, any> = {}
    constructor(options: Options) {
        this.appid = options.appid
        this.endpoint = options.endpoint
    }
    call(eventName: string, ...args: any[]) {
        if (!this.event_bus.has(eventName)) {
            console.log("[sniper]: 未实现该事件")
        }
        (this.event_bus.get(eventName) as AnyFunc[]).forEach(fn => fn(...args))
    }

    use(sender: Sender): void;
    use(plugins: Plugin[]): void;
    use(element: Plugin[] | Sender) {
        // 插件挂载
        if (Array.isArray(element)) {
            element.forEach(plugin => {
                // plugin 挂载到 monitor 实例上
                plugin.monitor = this;
                this.plugins.push(plugin)

                // 读取要监听的时间
                const event_entry = plugin.events();
                const event_name = Object.keys(event_entry);
                event_name.forEach(event => {
                    const event_callback = event_entry[event].bind(plugin)
                    if (this.event_bus.has(event)) {
                        (this.event_bus.get(event) as AnyFunc[]).push(event_callback)
                    } else {
                        this.event_bus.set(event, [event_callback])
                    }
                })
            })

        } else {
            // 发送器挂载
            element.endpoint = this.endpoint;
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
        this.plugins.forEach(plugin => plugin.unload())
    }

    track(data: any) {
        this.sender.send(data)
    }
}