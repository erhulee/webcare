import { Sender } from "../share/Sender"
import { WXMonitor } from "./WXMonitor";
import { HTTPMethod } from "../share/type"
class WXSender implements Sender<WXMonitor>{
    endpoint: string;
    instance: WXMonitor;
    method: HTTPMethod
    constructor(endpoint: string, instance: WXMonitor, method: HTTPMethod) {
        this.endpoint = endpoint;
        this.instance = instance;
        this.method = method;
    }
    post(data: any): void {
        const option: any = {
            data: JSON.stringify(data),
            url: this.endpoint,
            method: this.method == HTTPMethod.get ? "GET" : "POST"
        }
        wx.request(option);
    }

}

export default WXSender;