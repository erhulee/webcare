export enum LoggerCategory {
    Stability = "stability",
    Performance = "performance",
    Behavior = "behavior"
}

export enum LoggerType {
    HTTP = "http",
    FCP = "fcp",
    FP = "fp",
    TIMING = "timing",
    JS_ERROR = "js_error",
    UNHANDLED_PROMISE = 'unhandled_promise',
    PV = "pv",
    WEB_VITAL = "web_vital",
    Inner = "inner",
    LONG_TIME_TASK = "long_time_task"
}