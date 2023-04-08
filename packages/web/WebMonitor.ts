import { Monitor } from "../share/Monitor";
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { BeaconSender, XHRSender } from "./Sender";
import { Plugin } from "share/Plugin"
import { CrashPlugin, HTTPPlugin, JSErrorPlugin, ResourcePlugin } from "./plugins/stability/index";
import { LongTimeTaskPlugin, WebVitalsPlugin } from "./plugins/performance/index";
import { Sender } from "../share/Sender";
import { EventsPlugin } from "./plugins/behavior/events";
import { RrwebPlugin } from "./plugins/behavior/rrweb";
type WebSenderType = "xhr" | "beacon";
type SenderMethod = "post" | "get"

type SenderOption = {
    threshold: number,
    endpoint: string
} & ({
    method: "post",
    senderType: "xhr" | "beacon"
} | {
    method: "get",
    senderType: "xhr"
})
async function getDid() {
    const fpPromise = FingerprintJS.load()
    const fp = await fpPromise;
    const result = await fp.get();
    return result.visitorId;
}

class WebMonitor extends Monitor {
    // did -> 浏览器指纹
    fingerprint: string = "unknown";
    // uid -> 运行时注入，存在 uid 为空的情况，
    uid?: string
    // 发送器实例 sender 处理存储/压缩之类的具体逻辑，plugin 在发送数据的时候，会将后续控制权交给 sender 
    senderInstance?: Sender<WebMonitor>;
    // 事件栈，可能有用~ -> 统计页面跳出率
    eventStack: Array<{ pathName: string, event: Event | any }> = [];
    // rrwebstack 需要和 webworker 同步
    rrwebStack: any[] = [];
    // 插件
    plugins: Plugin[] = []
    // 插件会重写，此处只是作为类型定义
    trackLog?: (...arg: any[]) => void;
    trackPV(pathName: string, preLocation: { pathname: string }, search?: string,) {
        console.info("need override")
        // this.senderInstance?.post(createPVLogger(this, pathName, search));
        // const preEventIndex = this.eventStack.findIndex((item) => item.pathName == preLocation.pathname);
        // if (preEventIndex === -1 || preEventIndex === this.eventStack.length - 1) {
        //     this.senderInstance?.post(createBounceRateLogger(this, pathName))
        // }
    }
    send(data: any) {
        this.senderInstance?.post(data);
    }
    constructor(
        options: {
            appid: string,
            endpoint: string,
            plugins?: Plugin[]
        } & SenderOption
    ) {
        super(options.appid, options.endpoint, options.method);
        const { appid, method, senderType, threshold = 1, endpoint } = options;
        getDid().then(did => this.fingerprint = did)
        this.initSender(senderType, method, endpoint, threshold);
        this.initPlugins(options.plugins);
    }

    initSender(senderType: WebSenderType, senderMethod: SenderMethod, endpoint: string, threshold: number) {
        if (senderType == "beacon") {
            this.senderInstance = new BeaconSender(endpoint, this);
        } else {
            this.senderInstance = new XHRSender<(any & { appid: string })>(endpoint, this, senderMethod, threshold)
        }
    }

    private initPlugins(plugins: Plugin[] = [
        new JSErrorPlugin(this),
        new HTTPPlugin(this),
        new ResourcePlugin(this),
        new LongTimeTaskPlugin(this),
        new WebVitalsPlugin(this),
        new CrashPlugin(this),
        new EventsPlugin(this),
        new RrwebPlugin(this)
    ]) {
        this.plugins = plugins;
    }

    async start() {
        window.__SNIPER__ = this
        this.plugins.forEach(plugin => plugin.init());
        this.plugins.forEach(plugin => plugin.run());
    }
}

export default WebMonitor
