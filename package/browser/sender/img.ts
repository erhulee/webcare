import { Monitor } from "@/runtime";
import { connect } from "@/runtime/connect";
import { SniperLog } from "@/types/log";
import { HTTPMethod } from "@/types/other";
import { Sender } from "@/types/sender";


@connect
class ImageSender implements Sender {
    method: HTTPMethod = "get"
    monitor!: Monitor
    get endpoint() {
        return this.monitor.endpoint
    }
    send(log: SniperLog) {
        const image = new Image(1, 1);
        image.src = `${this.endpoint}?logger=${JSON.stringify(log)}`;
        image.onload = (e) => {
            console.log(e)
        }
    }
}

export default ImageSender