type LoggerCategory = "stability" | "behavior" | "performance"
type StabilityType  = "HTTP" | "WebSocket" | "Collapse" | "Resource" | "JS" 
type PerformanceType = "LongTimeTask"
export enum ResourceType {
    "Image",
    "CSS",
    "Font",
    "Javascript",
    "Video",
    "Audio"
}
interface Logger {
    category: LoggerCategory
    type: StabilityType | PerformanceType
}

export class JSErrorLogger implements Logger{
    category: "stability" = "stability"
    type: "JS" = "JS"
    stack: any
    message: string
    constructor(message:string, stack:any){
        this.stack   = stack;
        this.message = message;
    }
}


export class HTTPErrorLogger implements Logger{
    category: "stability" = "stability"
    type: "HTTP" = "HTTP"
    code: number 
    url: string
    constructor(code:number, url:string){
        this.code = code;
        this.url = url;
    }
}

export class ResourceLogger implements Logger{
    category: "stability" = "stability"
    type: "Resource" = "Resource"
    resourceType: ResourceType
    src: string
    constructor(resourceType: ResourceType, src: string){
        this.resourceType = resourceType
        this.src = src
    }
}

export class LongTaskLogger implements Logger{
    category: "performance" = "performance"
    type: "LongTimeTask" = "LongTimeTask"
    startTime:  number
    duration:   number
    eventType:  string
    eventName:  string
    constructor(startTime: number, duration:number, eventType:string, eventName:string){
        this.startTime = startTime;
        this.duration = duration;
        this.eventType = eventType;
        this.eventName = eventName
    }
}