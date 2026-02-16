"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import Image from "next/image";
import {
  Pencil,
  Plus,
  Trash2,
  ArrowRight,
  LayoutDashboard,
  LogOut,
  X,
  Loader2,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Room {
  id: number;
  slug: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { token, userName, logout, isAuthenticated } = useAuthStore();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomPassword, setNewRoomPassword] = useState("");
  const [showNewRoomPassword, setShowNewRoomPassword] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Join room state
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinSlug, setJoinSlug] = useState("");
  const [joinPassword, setJoinPassword] = useState("");
  const [showJoinPassword, setShowJoinPassword] = useState(false);
  const [joinNeedsPassword, setJoinNeedsPassword] = useState(false);
  const [joining, setJoining] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/signin");
    }
  }, [isAuthenticated, router]);

  // Fetch rooms
  const fetchRooms = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/rooms`, {
        headers: { authorization: token },
      });
      setRooms(res.data.rooms);
    } catch {
      setError("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Create room
  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;
    try {
      setCreating(true);
      setError("");
      const payload: { name: string; password?: string } = { name: newRoomName.trim() };
      if (newRoomPassword.trim()) {
        payload.password = newRoomPassword.trim();
      }
      const res = await axios.post(
        `${API_URL}/room`,
        payload,
        { headers: { authorization: token } }
      );
      if (res.data.roomId) {
        setNewRoomName("");
        setNewRoomPassword("");
        setShowModal(false);
        fetchRooms();
      }
    } catch {
      setError("Failed to create room. Name may already exist.");
    } finally {
      setCreating(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!joinSlug.trim()) return;
    try {
      setJoining(true);
      setError("");
      const res = await axios.get(`${API_URL}/room/${joinSlug.trim()}`);
      if (res.data.room) {
        if (res.data.room.hasPassword && !joinNeedsPassword) {
          // Show password input step
          setJoinNeedsPassword(true);
          setJoining(false);
          return;
        }
        if (res.data.room.hasPassword) {
          // Verify password
          const verifyRes = await axios.post(`${API_URL}/room/verify-password`, {
            slug: joinSlug.trim(),
            password: joinPassword,
          });
          if (!verifyRes.data.verified) {
            setError("Incorrect password.");
            setJoining(false);
            return;
          }
          // Pass verified password so RoomCanvas skips the second prompt
          sessionStorage.setItem("room_pwd", joinPassword);
          router.push(`/canvas/${joinSlug.trim()}`);
        } else {
          router.push(`/canvas/${joinSlug.trim()}`);
        }
      } else {
        setError("Room not found. Check the slug and try again.");
      }
    } catch (err: any) {
      if (err?.response?.status === 403) {
        setError("Incorrect password.");
      } else {
        setError("Room not found. Check the slug and try again.");
      }
    } finally {
      setJoining(false);
    }
  };

  // Delete room
  const handleDeleteRoom = async (slug: string) => {
    try {
      setDeleting(slug);
      await axios.delete(`${API_URL}/room/${slug}`, {
        headers: { authorization: token },
      });
      setRooms((prev) => prev.filter((r) => r.slug !== slug));
    } catch {
      setError("Failed to delete room");
    } finally {
      setDeleting(null);
    }
  };

  // Logout
  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,50,255,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(50,120,255,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:64px_64px] opacity-20" />
      </div>

      <div className="relative z-10">
        {/* Top bar */}
        <header className="border-b border-zinc-800/60 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="Zendraw Logo" width={48} height={48} className="rounded-xl shadow-lg shadow-violet-500/20" />
              <span className="text-lg font-bold tracking-tight">Zendraw</span>
            </div>

            {/* User info + actions */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-zinc-400">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </div>
              <div className="h-5 w-px bg-zinc-800 hidden sm:block" />
              <span className="text-sm text-zinc-400 hidden sm:block">
                {userName}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-400/10"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-6xl mx-auto px-6 py-10">
          {/* Title bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Your Rooms</h1>
              <p className="text-zinc-500 mt-1.5 text-sm">
                Manage and access your whiteboard rooms
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowJoinModal(true)}
                className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 border border-zinc-700"
              >
                <ArrowRight className="h-4 w-4" />
                Join Room
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Plus className="h-4 w-4" />
                Create Room
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 text-red-400 text-sm bg-red-400/10 px-4 py-3 rounded-xl border border-red-400/20 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError("")}>
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="h-8 w-8 text-violet-500 animate-spin" />
              <p className="text-zinc-500 text-sm">Loading your rooms…</p>
            </div>
          ) : rooms.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-32 gap-5">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <Pencil className="h-10 w-10 text-zinc-600" />
              </div>
              <div className="text-center">
                <h2 className="text-lg font-semibold text-zinc-300">
                  No rooms yet
                </h2>
                <p className="text-zinc-500 text-sm mt-1">
                  Create your first whiteboard room to get started
                </p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 shadow-lg shadow-violet-500/25 mt-2"
              >
                <Plus className="h-4 w-4" />
                Create your first room
              </button>
            </div>
          ) : (
            /* Room grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="group relative bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 hover:border-violet-500/40 hover:bg-zinc-900 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/5"
                >
                  {/* Gradient accent */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-violet-500/10 border border-violet-500/20 p-2.5 rounded-xl">
                        <Pencil className="h-4 w-4 text-violet-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm truncate max-w-[160px]">
                          {room.slug}
                        </h3>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {formatDate(room.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRoom(room.slug);
                      }}
                      disabled={deleting === room.slug}
                      className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition-all duration-200"
                      title="Delete room"
                    >
                      {deleting === room.slug ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Enter button */}
                  <button
                    onClick={() => router.push(`/canvas/${room.slug}`)}
                    className="w-full flex items-center justify-center gap-2 bg-zinc-800/80 hover:bg-violet-600 text-zinc-300 hover:text-white py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group/btn"
                  >
                    <span>Open Board</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Create Room Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => {
              setShowModal(false);
              setNewRoomName("");
            }}
          />

          {/* Modal */}
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl shadow-black/50 animate-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Create New Room</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewRoomName("");
                }}
                className="text-zinc-500 hover:text-white transition-colors p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">
                Room Name
              </label>
              <input
                type="text"
                placeholder="e.g. Sprint Planning Board"
                className="w-full p-3 rounded-xl bg-zinc-950 text-white border border-zinc-700 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder:text-zinc-600 text-sm"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateRoom();
                }}
                autoFocus
              />
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-zinc-400 mb-1.5 flex items-center gap-1.5">
                <Lock className="h-3 w-3" />
                Password (Optional)
              </label>
              <div className="relative">
                <input
                  type={showNewRoomPassword ? "text" : "password"}
                  placeholder="Leave empty for open access"
                  className="w-full p-3 pr-10 rounded-xl bg-zinc-950 text-white border border-zinc-700 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder:text-zinc-600 text-sm"
                  value={newRoomPassword}
                  onChange={(e) => setNewRoomPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateRoom();
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewRoomPassword(!showNewRoomPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showNewRoomPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {newRoomPassword && newRoomPassword.length < 4 && (
                <p className="text-[10px] text-amber-400 mt-1 px-1">Min 4 characters</p>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewRoomName("");
                }}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRoom}
                disabled={creating || !newRoomName.trim()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/25"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating…
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Room Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => {
              setShowJoinModal(false);
              setJoinSlug("");
              setJoinPassword("");
              setJoinNeedsPassword(false);
            }}
          />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl shadow-black/50 animate-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Join a Room</h2>
              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setJoinSlug("");
                  setJoinPassword("");
                  setJoinNeedsPassword(false);
                }}
                className="text-zinc-500 hover:text-white transition-colors p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">
                Room Slug
              </label>
              <input
                type="text"
                placeholder="Paste the room slug here..."
                className="w-full p-3 rounded-xl bg-zinc-950 text-white border border-zinc-700 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder:text-zinc-600 text-sm"
                value={joinSlug}
                onChange={(e) => setJoinSlug(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleJoinRoom();
                }}
                autoFocus={!joinNeedsPassword}
                disabled={joinNeedsPassword}
              />
            </div>

            {/* Password field - appears when room has a password */}
            {joinNeedsPassword && (
              <div className="mt-4">
                <label className="text-xs font-medium text-amber-400 mb-1.5 flex items-center gap-1.5">
                  <Lock className="h-3 w-3" />
                  This room is password protected
                </label>
                <div className="relative">
                  <input
                    type={showJoinPassword ? "text" : "password"}
                    placeholder="Enter room password"
                    className="w-full p-3 pr-10 rounded-xl bg-zinc-950 text-white border border-amber-500/50 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder:text-zinc-600 text-sm"
                    value={joinPassword}
                    onChange={(e) => setJoinPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleJoinRoom();
                    }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowJoinPassword(!showJoinPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  >
                    {showJoinPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setJoinSlug("");
                  setJoinPassword("");
                  setJoinNeedsPassword(false);
                }}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinRoom}
                disabled={joining || !joinSlug.trim() || (joinNeedsPassword && !joinPassword.trim())}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/25"
              >
                {joining ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Joining…
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-4 w-4" />
                    Join
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal animation */}
      <style jsx global>{`
        @keyframes animate-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-in {
          animation: animate-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
