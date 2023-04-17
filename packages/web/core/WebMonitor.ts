import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { BeaconSender, XHRSender } from "./Sender";
import { Monitor, Plugin } from "share/index"
import { CrashPlugin, HTTPPlugin, JSErrorPlugin, ResourcePlugin } from "../plugins/stability/index";
import { LongTimeTaskPlugin, WebVitalsPlugin } from "../plugins/performance/index";
import { Sender } from "share/Sender";
import { RrwebPlugin } from "plugins/behavior/rrweb";
import { PVPlugin } from 'web/plugins/behavior/pv';
import { EventsPlugin } from 'web/plugins/behavior/events';
import { BounceRatePlugin } from 'web/plugins/behavior/bounce-rate';
import { encode, decode } from 'js-base64';
const DEFAULT_LONGTASK_TIME = 50;
const DEFAULT_ENDPOINT = "https://bdul0j.laf.dev/logger"
type WebSenderType = "xhr" | "beacon";
type SenderMethod = "post" | "get"
type SenderOption = {
    threshold?: number,
    endpoint?: string
} & ({
    method: "post",
    senderType: "xhr" | "beacon"
} | {
    method: "get",
    senderType: "xhr"
})

const waitLoggerQueue: any[] = [];

async function getDid() {
    const fpPromise = FingerprintJS.load()
    const fp = await fpPromise;
    const result = await fp.get();
    return result.visitorId;
}

class WebMonitor extends Monitor {
    private hash_set: Set<string> = new Set<string>()
    // 长任务阈值
    longtask_time
    // did -> 浏览器指纹
    fingerprint: string = "unknown";
    waitUidFilled: boolean
    // uid -> 运行时注入，存在 uid 为空的情况，
    uid?: string
    // 发送器实例 sender 处理存储/压缩之类的具体逻辑，plugin 在发送数据的时候，会将后续控制权交给 sender 
    senderInstance?: Sender<WebMonitor>;
    // 事件栈，可能有用~ -> 统计页面跳出率
    eventStack: Array<{ pathName: string, event: Event | any }> = [];
    // rrwebstack 需要和 webworker 同步
    rrwebStack: any[] = [];

    nativeXHRSend?: Function
    // 插件
    // plugins: Plugin[] = []
    // 插件会重写，此处只是作为类型定义
    trackLog?: (...arg: any[]) => void;
    trackJSError(error: Error) {
        console.info("如果要使用，请使用 PVPlugin 覆盖这个方法")
    }
    trackPV() {
        console.info("如果要使用，请使用 PVPlugin 覆盖这个方法")
    }

    constructor(
        options: {
            longtask_time?: number
            appid: string,
            sample_rate?: number
            plugins?: Plugin[]
            waitUidFilled?: boolean
        } & SenderOption
    ) {
        super(options.appid, options.endpoint || DEFAULT_ENDPOINT, options.method, options.sample_rate);
        const { method, senderType, threshold = 1, endpoint, longtask_time = DEFAULT_LONGTASK_TIME, waitUidFilled = false } = options;
        this.waitUidFilled = waitUidFilled
        this.longtask_time = longtask_time
        getDid().then(did => this.fingerprint = did)
        this.initSender(senderType, method, endpoint || DEFAULT_ENDPOINT, threshold);
        this.initPlugins(options.plugins);
    }

    // 频控 / 检查 / uid
    // data 不许是 array，呜呜呜
    send(data: any) {
        if (data == null) return;
        // 暂定频控
        if (Math.random() > this.sample_rate) return;
        // hash去除重复
        // const hash_key = encode(data);
        // console.log("hash keyP", hash_key)
        // if (this.hash_set.has(hash_key)) return;
        // this.hash_set.add(hash_key);
        // did 检查
        // did 检查合法
        if (!this.fingerprint || this.fingerprint !== "unknown") {
            if (!this.waitUidFilled) {
                this.senderInstance?.post(data);
            } else {
                const hasUid = Boolean(this.uid) || this.uid !== "unknown"
                if (hasUid) {
                    const postData = waitLoggerQueue.map(log => ({ ...log, uid: this.uid })).concat(data);
                    this.senderInstance?.post(postData);
                } else {
                    waitLoggerQueue.push(data);
                }
            }
            // did 不合法 -> 暂存
        } else {
            waitLoggerQueue.push(data)
        }
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
        new RrwebPlugin(this),
        new PVPlugin(this),
        new EventsPlugin(this),
        new BounceRatePlugin(this)
    ]) {
        this.plugins = plugins;
    }

    async start() {
        window.__SNIPER__ = this
        this.plugins.forEach(plugin => plugin.init && plugin.init());
        this.plugins.forEach(plugin => plugin.run());
    }

    setUid(uid: string) {
        this.uid = uid
    }

    destroy() {
        this.plugins.forEach(plugin => plugin.unload && plugin.unload())
    }
}

export default WebMonitor
