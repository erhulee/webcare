/**
 * 一个页面维度（每个不一样的URL都算是一个新的页面），前端先不去重了，后面再说；
 */

import { InjectEnvironmentInfo } from "./base"
import { LoggerCategory, LoggerType } from "./constant"

export default function createPVLogger(params: {
    url: string
}) {
    return InjectEnvironmentInfo({
        category: LoggerCategory.Behavior,
        type: LoggerType.PV,
        url: params.url
    })
}