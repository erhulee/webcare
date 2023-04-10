
export interface Plugin {
    monitor?: any
    init?: Function;
    run: Function;
    unload?: Function;
}