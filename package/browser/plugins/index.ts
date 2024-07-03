import JsErrorPlugin from "./stability/jserror";
import HTTPPlugin from "./stability/http";
import ResourcePlugin from "./stability/resource";
import { RecordPlugin } from "./stability/record";
import { FPPlugin, CLSPlugin, DOMMutationPlugin, FCPPlugin, WebVitalsPlugin, TimingPlugin } from "./performance/index"
import { PVPlugin } from "./behavior/pv"
export {
    JsErrorPlugin,
    HTTPPlugin,
    ResourcePlugin,
    FPPlugin,
    CLSPlugin,
    DOMMutationPlugin,
    FCPPlugin,
    WebVitalsPlugin,
    RecordPlugin,
    PVPlugin,
    TimingPlugin
}
