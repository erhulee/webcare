import { JsErrorPlugin, HTTPPlugin, ResourcePlugin } from "src/plugins/index";
import { Monitor } from "../runtime";
import { XHRSender } from "src/sender";

const instance = new Monitor({
    appid: "ab123",
    endpoint: "www.example.com"
})

instance.use([
    new JsErrorPlugin(40),
    new HTTPPlugin(),
    new ResourcePlugin(),
])

instance.use(new XHRSender("post"))
