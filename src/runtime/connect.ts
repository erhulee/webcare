export const connect: ClassDecorator = (target: Function) => {
    Object.defineProperty(target.prototype, "monitor", {
        get() {
            return window.__SNIPER__
        }
    })
}