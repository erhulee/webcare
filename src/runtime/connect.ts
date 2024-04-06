/**
 * 装饰器，传入一个类，给他挂载一个 getter 可以获取到 monitor 示例
 * @param target plugin / sender
 */
export const connect: ClassDecorator = (target: Function) => {
    Object.defineProperty(target.prototype, "monitor", {
        get() {
            return window.__SNIPER__
        }
    })
}