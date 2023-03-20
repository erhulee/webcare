import WebMonitor  from "web/WebMonitor"
import {Plugin} from "share/Plugin"
import { createCrashLogger } from "../../logger/index"
import { work_source } from "./webwork"

export class CrashPlugin implements Plugin {
    instance: WebMonitor
    worker: Worker | null
    constructor(instance: WebMonitor){
        this.instance = instance
        this.worker = null
    }
    init(){

    }
    run(){
        // const worker = new Worker("webwork.js");
        const content =  new Blob([work_source]);
        const worker = new Worker(URL.createObjectURL(content));
        this.worker = worker;
        worker.postMessage({
            type: "init",
            endpoint: this.instance.endpoint,
            method: this.instance.method,
            logger: createCrashLogger(this.instance)
        })

        worker.addEventListener("message", (message)=>{
            const data = message.data;
            worker.postMessage(data)
        })
    }
    unload(){
        if(this.worker){
            this.worker.terminate()
        }
    }
}

