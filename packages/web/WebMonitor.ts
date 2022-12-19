import { Monitor } from "../share/Monitor";
// import FingerprintJS, { GetResult } from '@fingerprintjs/fingerprintjs'
import { BeaconSender, Sender, XHRSender } from "./Sender";
import {Plugin} from "share/Plugin"
import { HTTPPlugin, JSErrorPlugin, ResourcePlugin } from "./plugins/stability/index";
// const fpPromise = FingerprintJS.load()
type WebSenderType = "xhr" | "beacon";
type SenderMethod = "post" | "get"
class WebMonitor extends Monitor  {
    fingerprint: string;
    senderInstance?: Sender<WebMonitor>;
    plugins: Plugin[]
    // private async setFingerPrint(){
    //     const fp = await fpPromise;
    //     const result = await fp.get();
    //     this.fingerprint = result.visitorId;
    // }
    constructor(
        appid:string, 
        endpoint: string, 
        method: "get" | "post", 
        senderType:WebSenderType = "xhr",
        threshold: number = 1
        ){
        super(appid, endpoint, method);
        this.fingerprint = "unknown"
        this.plugins = [];
        // this.setFingerPrint();
        this.initSender(senderType, method, endpoint, threshold);
        this.initPlugins();
    }

    initSender(senderType: WebSenderType, senderMethod:SenderMethod, endpoint:string, threshold: number) {
        let _type = senderType;
        let _method = senderMethod;
        if(senderMethod == "get" && senderType == "beacon"){
            console.error("Beacon上报不支持 get 方法, 将用 xhr 继续上传");
            _type = "xhr";
            _method = "get";
        }else if(senderType == "beacon"){
            if(typeof window?.navigator?.sendBeacon !== 'function'){
                console.error("浏览器不兼容Beacon，将用 xhr 继续上传");
                _type = "xhr";
                _method = senderMethod;
            }
        }

        if(_type == "beacon"){
            this.senderInstance = new BeaconSender(endpoint, this);
        }else{
            this.senderInstance = new XHRSender(endpoint, this, senderMethod, threshold)
        }
    }

    private initPlugins(){
        const plugins:Plugin[] = [
            new JSErrorPlugin(this),
            new HTTPPlugin(this),
            new ResourcePlugin(this)
        ]
        this.plugins = plugins;
    }
    
    start(){
        this.plugins.forEach(plugin=>{
            plugin.run();
        })
    }
}

export default WebMonitor