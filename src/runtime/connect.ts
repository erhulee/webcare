export const connect: ClassDecorator = (target: Function) => {
    Object.defineProperty(target.prototype, "monitor", {
        get() {
            return (window as any).__SNIPER__
        }
    })
}