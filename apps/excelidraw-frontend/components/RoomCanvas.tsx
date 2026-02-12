"use client";

import { useEffect, useState } from "react";
import { ws_URL, BACKEND_URL } from "@/config";
import Canvas from "@/components/Canvas";
import axios from "axios";
import { Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

export default function RoomCanvas({slug, initialPassword}: { slug: string; initialPassword?: string}){

    const [socket , setSocket] = useState<WebSocket | null>(null);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [needsPassword, setNeedsPassword] = useState(false);
    const [passwordVerified, setPasswordVerified] = useState(false);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    // Resolve slug to numeric roomId and check password
    useEffect(() => {
        async function resolveRoom() {
            try {
                const res = await axios.get(`${BACKEND_URL}/room/${slug}`);
                const room = res.data.room;
                if (!room) {
                    setError("Room not found");
                    setLoading(false);
                    return;
                }
                setRoomId(String(room.id));
                if (room.hasPassword) {
                    if (initialPassword) {
                        // Auto-verify password passed from the join modal
                        try {
                            const verifyRes = await axios.post(`${BACKEND_URL}/room/verify-password`, {
                                slug,
                                password: initialPassword,
                            });
                            if (verifyRes.data.verified) {
                                setPasswordVerified(true);
                                setLoading(false);
                                return;
                            }
                        } catch {}
                        // If auto-verify failed, fall through to manual password gate
                    }
                    setNeedsPassword(true);
                } else {
                    setPasswordVerified(true);
                }
                setLoading(false);
            } catch (e) {
                setError("Failed to find room");
                setLoading(false);
            }
        }
        resolveRoom();
    }, [slug, initialPassword]);

    // Handle password verification
    const handleVerify = async () => {
        if (!password.trim()) return;
        try {
            setVerifying(true);
            setError("");
            const res = await axios.post(`${BACKEND_URL}/room/verify-password`, {
                slug,
                password,
            });
            if (res.data.verified) {
                setPasswordVerified(true);
            }
        } catch (err: any) {
            if (err?.response?.status === 403) {
                setError("Incorrect password");
            } else {
                setError("Verification failed");
            }
        } finally {
            setVerifying(false);
        }
    };

    // Connect WebSocket once roomId is resolved AND password verified
    useEffect(() => {
        if (!roomId || !passwordVerified) return;
        
        let token = "";
        try {
            const stored = localStorage.getItem("auth-storage");
            if (stored) {
                const parsed = JSON.parse(stored);
                token = parsed?.state?.token || "";
            }
        } catch {}
        const ws = new WebSocket(`${ws_URL}?token=${token}`);

         ws.onopen = () => {
            setSocket(ws);
            const data = JSON.stringify({
                type: "join_room",
                roomId
            });
            ws.send(data)
        }

        return () => {
            ws.close();
        }
    }, [roomId, passwordVerified])

    // Loading state
    if (loading) {
        return (
            <div className="w-screen h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-violet-500 animate-spin" />
            </div>
        );
    }

    // Room not found
    if (error && !needsPassword) {
        return (
            <div className="w-screen h-screen bg-black flex items-center justify-center">
                <p className="text-red-400">{error}</p>
            </div>
        );
    }

    // Password gate
    if (needsPassword && !passwordVerified) {
        return (
            <div className="w-screen h-screen bg-black flex items-center justify-center">
                {/* Background effects */}
                <div className="fixed inset-0 z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,50,255,0.12),transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(50,120,255,0.08),transparent_50%)]" />
                </div>

                <div className="relative z-10 bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-sm mx-4 shadow-2xl">
                    <div className="flex flex-col items-center gap-3 mb-6">
                        <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-2xl">
                            <Lock className="h-6 w-6 text-amber-400" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-lg font-bold text-white">Password Required</h2>
                            <p className="text-xs text-zinc-500 mt-1">
                                Room <span className="text-zinc-300 font-medium">{slug}</span> is protected
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 text-red-400 text-xs bg-red-400/10 px-3 py-2 rounded-xl border border-red-400/20 text-center">
                            {error}
                        </div>
                    )}

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            className="w-full p-3 pr-10 rounded-xl bg-zinc-950 text-white border border-zinc-700 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder:text-zinc-600 text-sm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleVerify();
                            }}
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>

                    <button
                        onClick={handleVerify}
                        disabled={verifying || !password.trim()}
                        className="w-full flex items-center justify-center gap-2 mt-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/25"
                    >
                        {verifying ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Verifying…
                            </>
                        ) : (
                            <>
                                <ArrowRight className="h-4 w-4" />
                                Enter Room
                            </>
                        )}
                    </button>
                </div>
            </div>
        );
    }

    // Connecting state
    if (!socket || !roomId){
        return (
            <div className="w-screen h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-violet-500 animate-spin" />
            </div>
        );
    }

    return <div>
        <Canvas roomId={roomId} socket={socket} />
    </div>
}