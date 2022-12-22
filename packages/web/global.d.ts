interface Window {
    _fetch:(input: RequestInfo, init?: RequestInit | undefined)=>Promise<Response>;
}
  
declare var window: Window;


