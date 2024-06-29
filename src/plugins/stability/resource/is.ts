/**
 * 判断资源加载是否失败
 *
 * @param entry - 资源加载信息对象
 * @return 如果资源大小为 0，则返回 true；否则返回 false
 */
export function isFail(entry: PerformanceResourceTiming) {
    const fileSize = entry.transferSize;
    if (fileSize == 0) {
        return true
    } else {
        return false
    }
}