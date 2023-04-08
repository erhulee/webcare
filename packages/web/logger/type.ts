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

