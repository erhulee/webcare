import { Monitor } from "./runtime/index"
import { RecordPlugin, TimingPlugin, JsErrorPlugin, LongTaskPlugin, HTTPPlugin, ResourcePlugin, CLSPlugin, FPPlugin, DOMMutationPlugin, FCPPlugin, WebVitalsPlugin } from "./plugins/index"
import { XHRSender } from "./sender/index"
import ImageSender from "./sender/img"
export {
    Monitor,
    JsErrorPlugin,
    HTTPPlugin,
    XHRSender,
    ImageSender,
    ResourcePlugin,
    CLSPlugin,
    FPPlugin,
    DOMMutationPlugin,
    FCPPlugin,
    WebVitalsPlugin,
    RecordPlugin,
    TimingPlugin,
    LongTaskPlugin
}
