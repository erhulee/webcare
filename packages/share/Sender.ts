export interface Sender<T>{
    endpoint: string,
    instance: T;

    post(data:any):void;
}