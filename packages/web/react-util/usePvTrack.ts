import { useContext, useEffect } from "react";
import { useLocation } from "react-router";
import { Context } from "./SniperOuter";
export function usePvTrack() {
    const location = useLocation();
    const monitor = useContext(Context)
    useEffect(() => {
        monitor?.trackPV();
        // sdk.trackPV(location.pathname, preLocation, location.search);
    }, [location]);
}

