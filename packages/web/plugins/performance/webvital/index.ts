
import {onCLS, onFID, onLCP, onFCP, onTTFB} from 'web-vitals';
// import {} from "web-vitals"
import  WebMonitor  from "web/WebMonitor"
import {Plugin} from "share/Plugin"
import {  createWebVitalLogger } from "../../logger/index"

export class WebVitalsPlugin implements Plugin{
    instance:WebMonitor
    performance:any

    constructor(instance:WebMonitor){
        this.instance = instance
        this.performance = {};
    }
    init(){}
    private collectValue(methods:Function[], names:string[]){
        return Promise.all(methods.map((method, index)=>{
            return new Promise((resolve, reject)=>{
                method((value:any)=>{
                console.log("还在收集:", value)

                    const key = names[index]
                    this.performance[key] = value;
                    resolve(value)
                })
            })
        }))
    }

    async run(){
        await this.collectValue([onCLS, onFID, onLCP, onFCP, onTTFB], ["CLS", "FID", "LCP", "FCP", "TTFB"])
        console.log("收集完毕:", this.performance)
        this.instance.senderInstance?.post(createWebVitalLogger(this.instance, this.performance))
    }
    unload(){
       
    }

}
