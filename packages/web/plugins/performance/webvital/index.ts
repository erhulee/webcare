
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


    async run(){
        const callback = (value:any)=>{
            this.instance.senderInstance?.post(createWebVitalLogger(this.instance, value))
        }   

     
        [onCLS, onFID, onLCP, onFCP, onTTFB].forEach(method =>{
            method(callback)
        })

       
    }
    unload(){
       
    }

}


