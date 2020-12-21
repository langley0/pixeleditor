import { useEffect, useRef} from "react";

export function useInterval(callback: () => void, delay: number) {
    const savedCallback = useRef(callback);
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            savedCallback.current();
        }

        const timer = setInterval(tick, delay);
        return () => {
            clearInterval(timer);
        };
    }), [callback, delay];
}