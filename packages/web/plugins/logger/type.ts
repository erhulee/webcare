type LoggerCategory = "stability" | "behavior" | "performance"
type StabilityType  = "HTTP" | "WebSocket" | "Collapse" | "Resource" | "JSError" 
interface Logger {
    category: LoggerCategory
    type: StabilityType
}

export class JSErrorLogger implements Logger{
    category: "stability" = "stability"
    type: "JSError" = "JSError"
    stack: any
    message: string
    constructor(message:string, stack:any){
        this.stack   = stack;
        this.message = message;
    }
}



