import { Plugin } from "./Plugin";
type WebSenderType = "xhr"|"beacon"
export class Monitor{
    appid: string;
    endpoint: string;
    method: "get" | "post";
    plugins: Plugin[]
    constructor(appid:string, endpoint: string, method: "get" | "post"){
        this.appid      = appid;
        this.endpoint   = endpoint;
        this.method     = method;
        this.plugins    = [];
    }
    // only for web
    initSender(senderType: WebSenderType, senderMethod:"get" | "post", endpoint:string, threshold: number): void;
    initSender():void{
        console.error("需要重写 InitSender 方法")
    }
}