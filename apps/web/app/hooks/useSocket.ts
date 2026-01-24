import { useEffect, useState } from "react";
import { WS_URL } from "../config";

export function useSocket() {
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();

        useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNWQ2ZjQzMy1hNmIwLTQwYTgtODhjZi1iOTMyNWY2YTYxYWYiLCJpYXQiOjE3NjkxMjE1OTN9.Ji3g8kjdkH5mC76YxMAt6WJLuT5pofJrQ9zHaT9DdmM`);
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }
    }, []);

    return {
        loading,
        socket
    }

}