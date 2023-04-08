type Options = {
    beforeFn?: (...arg: any[]) => void
    afterFn?: (...arg: any[]) => void
}
export function captureNativeFn(options: Options, key: string, globalObject: Window | any = window) {
    const { beforeFn = () => { }, afterFn = () => { } } = options;
    const nativeFn = globalObject[key];
    if (typeof nativeFn !== "function") return;
    const fn = (...args: any[]) => {
        beforeFn(...args);
        nativeFn(...args);
        afterFn(...args);
    }
    globalObject[key] = fn;
}

