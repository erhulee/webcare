import  WebMonitor  from "web/WebMonitor"
import {Plugin} from "share/Plugin"
import { MAX_DURATION } from "./constant"
import { createLongTaskLogger } from "../../logger/index"

export class LongTimeTaskPlugin implements Plugin {
    instance: WebMonitor
    observer?: PerformanceObserver
    constructor(instance: WebMonitor){
        this.instance = instance
    }
    init(){}
    run(){
        const callback = (entryList:PerformanceObserverEntryList) => {
            entryList.getEntries().forEach((entry) => {
              if (entry.duration < MAX_DURATION) return;
              const logger = createLongTaskLogger(this.instance, entry);
              this.instance.senderInstance?.post(logger)
            });
            }
        this.observer = new PerformanceObserver(callback)
        this.observer.observe({ entryTypes: ["longtask"] });
    }
    unload(){
        this.observer?.disconnect()
    }
}

