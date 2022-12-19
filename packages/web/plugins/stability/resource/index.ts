
import WebMonitor from "web/WebMonitor";
import {Plugin} from "share/Plugin"
import { createResourceLogger } from "../../logger/index";
import { ResourceType } from "../../logger/type";
/*
    1. performance
    2. window.onerror
    css、js、image、video、audio
*/
const tagName2ResourceType:{[key:string]: ResourceType} = {
    link: ResourceType.CSS,
    script: ResourceType.Javascript,
    img: ResourceType.Image,
    video: ResourceType.Video,
    audio: ResourceType.Audio 
}
export class ResourcePlugin implements Plugin{
    instance:  WebMonitor
    listener: ((e: any) => void) | null = null
    constructor(instance:WebMonitor){
        this.instance = instance; 
    }
    init(){
        
    }
    run(){
        const that = this;
        const listener = function(e:any){
            const typeName = e.target.localName;
            const url = e.target.src
            let logger = createResourceLogger( that.instance, tagName2ResourceType[typeName], url)
            that.instance.senderInstance?.post(logger)
        }
        this.listener = listener;
        window.addEventListener("error", listener, true)
    };
    unload(){
        if(this.listener){
            window.removeEventListener("error", this.listener)
        }
    };
}
