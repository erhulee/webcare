import { Plugin } from "./Plugin";
type WebSenderType = "xhr" | "beacon"
export class Monitor {
    // 采样频率
    sample_rate: number
    appid: string;
    endpoint: string;
    method: "get" | "post";
    plugins: Plugin[] = []
    constructor(appid: string, endpoint: string, method: "get" | "post", sample_rate = 0.5) {
        this.appid = appid;
        this.endpoint = endpoint;
        this.method = method;
        if (sample_rate > 1) {
            this.sample_rate = 1
        } else if (sample_rate < 0) {
            this.sample_rate = 0;
        } else {
            this.sample_rate = sample_rate
        }
    }
    // only for web
    initSender(senderType: WebSenderType, senderMethod: "get" | "post", endpoint: string, threshold: number): void;
    initSender(): void {
        console.error("需要重写 InitSender 方法")
    }
}