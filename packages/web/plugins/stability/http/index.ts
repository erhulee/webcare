import { createHTTPLogger } from "../../logger/index";
import  WebMonitor  from "web/WebMonitor"
import {Plugin} from "share/Plugin"
import {isStatusOk} from "../../../util";


export class HTTPPlugin implements Plugin {
    // monitor:WebMonitor
    instance: WebMonitor;
    nativeXHRSend?:any
    nativeFetch?:any
    duringHijack:boolean
    constructor(monitor:WebMonitor){
        this.instance = monitor
        this.duringHijack = false
    }

    init(){}
    run(){
        const instance = this
        /* xhr 劫持 */
        this.nativeXHRSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(...arg){
            let self = this;
            self.addEventListener("abort", function(){
                // TODO abort 以后再说
                // const logger = createHTTPLogger("absort", "", {});
                // instance.monitor.senderInstance?.post(logger)
            })
            self.addEventListener("readystatechange", function(){
                if(this.readyState == 4 && !isStatusOk(this.status)){
                    const logger = createHTTPLogger(instance.instance, this, "XHR")
                    instance.instance.senderInstance?.post(logger)
                }
            })
            instance.nativeXHRSend.apply(self, arg)
        }
        /* fetch 劫持 */
        if(!window.fetch) return;
        this.nativeFetch = fetch
        window.fetch = function(...arg){
            const promise = instance.nativeFetch(...arg);
            promise.then((response:Response)=>{
                if(response.ok){
                    //TODO 观察怎么拿到需要的信息
                    const logger = createHTTPLogger(instance.instance, response, "Fetch");
                    instance.instance.senderInstance?.post(logger)
                }
            }, (error:any)=>{
                // TODO abort 以后再说
                // const logger = createHTTPLogger("absort", "", {});
                // instance.monitor.sender?.post(logger)
            })
            return promise;
        }
    }
    unload(){
	    XMLHttpRequest.prototype.send = this.nativeXHRSend
        window.fetch = this.nativeFetch
	}
}