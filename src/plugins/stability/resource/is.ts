import { get } from "lodash-es";

/**
 * 检查一个 PerformanceResourceTiming 对象是否表示一个跨源资源请求。
 * 一个跨源资源请求是指请求的资源的源（origin）与当前页面的源不同。
 *
 * @param entry - 一个 PerformanceResourceTiming 对象，表示要检查的资源加载。
 * @returns 如果请求的资源的源与当前页面的源不同，返回 true，否则返回 false。
 *
 */
export function isCORS(entry: PerformanceResourceTiming) {
    const url = new URL(entry.name);
    const entry_origin = url.origin;
    const current_origin = window.location.origin;
    return entry_origin !== current_origin;
}
/**
 * 判断资源加载是否失败
 *
 * @param entry - 资源加载信息对象
 * @return 如果资源大小为 0，则返回 true；否则返回 false
 */
export function isFail(entry: PerformanceResourceTiming) {
    const status = get(entry, "responseStatus", 0) as number;
    if (status == 200) {
        return false
    }
    if (entry.responseStart != 0) {
        return false
    }
    if (entry.encodedBodySize != 0) {
        return false
    }
    if (isCORS(entry)) {
        // 跨域资源 skip
        return false
    } else {
        return true
    }
}