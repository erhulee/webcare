import { Monitor } from "../share/Monitor";
import { HTTPMethod } from "../share/type";
import Sender  from "./Sender";
export class WXMonitor extends Monitor {
    senderInstance?: Sender
    
    constructor( 
        appid:string, 
        endpoint: string, 
        method: HTTPMethod
    ){
        super(appid, endpoint, method);
        this.plugins = [];
        this.senderInstance = new Sender(endpoint, this, method);
        this.initPlugins()
    }


    private initPlugins(){
        
    }


}