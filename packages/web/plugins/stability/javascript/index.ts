
// import { Plugin } from "../../../../core/plugin";
// import { WebMonitor } from "../../../core";
// import { createJSErrorLogger, createPromiseErrorLogger } from "../logger/jserrorLogger";

import WebMonitor from "web/WebMonitor";
import { createJSErrorLogger } from "../../logger/index";
import {Plugin} from "share/Plugin"

export class JSErrorPlugin implements Plugin{
    instance: WebMonitor;
    error_listener: any;
    promise_listener: any;
    hasError: boolean;
    events: any[];
    constructor(instance:WebMonitor){
        this.instance = instance;
        this.hasError = false;
        this.events = [];
        const sender = instance.senderInstance;
        this.error_listener = (e:ErrorEvent)=>{
            const log = createJSErrorLogger(instance, e.message, e.error.stack)
            sender?.post(log);
            this.hasError = true;
        }
        this.promise_listener = (e:ErrorEvent)=>{
            if((e as any).target.localname !== undefined) return;
            const log = createJSErrorLogger(instance, e.message, e.error?.stack)
            sender?.post(log);
            this.hasError = true;
        }
    }
    init(){

    }
    run(){
        console.log("开始监听")
        window.addEventListener("error", this.error_listener)
        window.addEventListener("unhandledrejection", this.promise_listener)
    }
    unload(){
        window.removeEventListener("error", this.error_listener)
        window.removeEventListener("unhandledrejection", this.promise_listener)
    }
    
}