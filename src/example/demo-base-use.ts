import JsErrorPlugin from "src/plugins/stability/jserror";
import { Monitor } from "../runtime";

const instance = new Monitor({
    appid: "ab123",
    endpoint: "www.example.com"
})

instance.use([
    new JsErrorPlugin(40)
])

// instance.use()