import { useRef } from "react";

function useMonitor() {
    const monitorRef = useRef(window.__SNIPER__)
    return monitorRef
}


export default useMonitor

