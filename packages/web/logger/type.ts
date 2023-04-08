type LoggerCategory = "stability" | "behavior" | "performance"
type StabilityType = "HTTP" | "WebSocket" | "Collapse" | "Resource" | "JS"
type PerformanceType = "LongTimeTask" | "WebVitals"
export type WebVital = {
    "CLS": string | number
    "FID": string | number
    "LCP": string | number
    "FCP": string | number
    "TTFB": string | number
}
export enum ResourceType {
    Image = "img",
    CSS = "link",
    Javascript = "script",
    Video = "video",
    Audio = "audio",

    Unknown = "unknown"
}
interface Logger {
    category: LoggerCategory
    type: StabilityType | PerformanceType
}



export class CrashLogger implements Logger {
    category: "stability" = "stability"
    type: "Collapse" = "Collapse"
    constructor() { }
}

// export class LongTaskLogger implements Logger {
//     category: "performance" = "performance"
//     type: "LongTimeTask" = "LongTimeTask"
//     startTime: number
//     duration: number
//     eventType: string
//     eventName: string
//     constructor(startTime: number, duration: number, eventType: string, eventName: string) {
//         this.startTime = startTime;
//         this.duration = duration;
//         this.eventType = eventType;
//         this.eventName = eventName
//     }
// }

// export class WebVitalsLogger implements Logger {
//     category: "performance" = "performance"
//     type: "WebVitals" = "WebVitals"

//     // webvitals: WebVital
//     constructor() {
//         // this.webvitals = webvitals
//     }
// }
