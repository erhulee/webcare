import { Monitor } from "../share/Monitor";
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { BeaconSender, XHRSender } from "./Sender";
import { Plugin } from "share/Plugin"
import { CrashPlugin, HTTPPlugin, JSErrorPlugin, ResourcePlugin } from "./plugins/stability/index";
import { LongTimeTaskPlugin, WebVitalsPlugin } from "./plugins/performance/index";
import { Sender } from "../share/Sender";
import { RrwebPlugin } from "./plugins/behavior/rrweb";
const DEFAULT_LONGTASK_TIME = 50;
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
    // 长任务阈值
    longtask_time
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
    // plugins: Plugin[] = []
    // 插件会重写，此处只是作为类型定义
    trackLog?: (...arg: any[]) => void;
    trackPV() {
        console.info("如果要使用，请使用 PVPlugin 覆盖这个方法")
    }

    constructor(
        options: {
            longtask_time?: number
            appid: string,
            endpoint: string,
            sample_rate?: number
            plugins?: Plugin[]
        } & SenderOption
    ) {
        super(options.appid, options.endpoint, options.method, options.sample_rate);
        const { method, senderType, threshold = 1, endpoint, longtask_time = DEFAULT_LONGTASK_TIME } = options;
        this.longtask_time = longtask_time
        getDid().then(did => this.fingerprint = did)
        this.initSender(senderType, method, endpoint, threshold);
        this.initPlugins(options.plugins);
    }

    // 频控 / 检查
    send(data: any) {
        if (data == null) return;
        // 暂定频控
        if (Math.random() > this.sample_rate) return;
        this.senderInstance?.post(data);
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
        new RrwebPlugin(this)
    ]) {
        this.plugins = plugins;
    }

    async start() {
        window.__SNIPER__ = this
        this.plugins.forEach(plugin => plugin.init());
        this.plugins.forEach(plugin => plugin.run());
    }

    setUid(uid: string) {
        this.uid = uid
    }
}

export default WebMonitor
