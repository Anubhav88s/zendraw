import { create } from "zustand";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Room {
  id: number;
  slug: string;
  createdAt: string;
}

interface RoomState {
  // Room data
  rooms: Room[];
  loading: boolean;
  error: string;

  // Create room
  newRoomName: string;
  newRoomPassword: string;
  creating: boolean;
  showModal: boolean;
  showNewRoomPassword: boolean;

  // Join room
  joinSlug: string;
  joinPassword: string;
  joining: boolean;
  showJoinModal: boolean;
  showJoinPassword: boolean;
  joinNeedsPassword: boolean;

  // Delete room
  deleting: string | null;

  // Actions
  setError: (error: string) => void;
  setNewRoomName: (name: string) => void;
  setNewRoomPassword: (password: string) => void;
  setShowModal: (show: boolean) => void;
  setShowNewRoomPassword: (show: boolean) => void;
  setJoinSlug: (slug: string) => void;
  setJoinPassword: (password: string) => void;
  setShowJoinModal: (show: boolean) => void;
  setShowJoinPassword: (show: boolean) => void;
  setJoinNeedsPassword: (needs: boolean) => void;

  fetchRooms: (token: string) => Promise<void>;
  createRoom: (token: string) => Promise<boolean>;
  joinRoom: () => Promise<{ success: boolean; needsPassword?: boolean; slug?: string }>;
  deleteRoom: (slug: string, token: string) => Promise<boolean>;

  resetCreateModal: () => void;
  resetJoinModal: () => void;
}

export const useRoomStore = create<RoomState>()((set, get) => ({
  // Room data
  rooms: [],
  loading: true,
  error: "",

  // Create room
  newRoomName: "",
  newRoomPassword: "",
  creating: false,
  showModal: false,
  showNewRoomPassword: false,

  // Join room
  joinSlug: "",
  joinPassword: "",
  joining: false,
  showJoinModal: false,
  showJoinPassword: false,
  joinNeedsPassword: false,

  // Delete room
  deleting: null,

  // Setters
  setError: (error) => set({ error }),
  setNewRoomName: (newRoomName) => set({ newRoomName }),
  setNewRoomPassword: (newRoomPassword) => set({ newRoomPassword }),
  setShowModal: (showModal) => set({ showModal }),
  setShowNewRoomPassword: (showNewRoomPassword) => set({ showNewRoomPassword }),
  setJoinSlug: (joinSlug) => set({ joinSlug }),
  setJoinPassword: (joinPassword) => set({ joinPassword }),
  setShowJoinModal: (showJoinModal) => set({ showJoinModal }),
  setShowJoinPassword: (showJoinPassword) => set({ showJoinPassword }),
  setJoinNeedsPassword: (joinNeedsPassword) => set({ joinNeedsPassword }),

  // Fetch all rooms
  fetchRooms: async (token) => {
    if (!token) return;
    try {
      set({ loading: true });
      const res = await axios.get(`${API_URL}/rooms`, {
        headers: { authorization: token },
      });
      set({ rooms: res.data.rooms, loading: false });
    } catch {
      set({ error: "Failed to load rooms", loading: false });
    }
  },

  // Create a new room
  createRoom: async (token) => {
    const { newRoomName, newRoomPassword } = get();
    if (!newRoomName.trim()) return false;
    try {
      set({ creating: true, error: "" });
      const payload: { name: string; password?: string } = {
        name: newRoomName.trim(),
      };
      if (newRoomPassword.trim()) {
        payload.password = newRoomPassword.trim();
      }
      const res = await axios.post(`${API_URL}/room`, payload, {
        headers: { authorization: token },
      });
      if (res.data.roomId) {
        set({
          newRoomName: "",
          newRoomPassword: "",
          showModal: false,
          creating: false,
        });
        // Re-fetch rooms to update the list
        get().fetchRooms(token);
        return true;
      }
      set({ creating: false });
      return false;
    } catch {
      set({
        error: "Failed to create room. Name may already exist.",
        creating: false,
      });
      return false;
    }
  },

  // Join a room — returns routing info for the component to navigate
  joinRoom: async () => {
    const { joinSlug, joinPassword, joinNeedsPassword } = get();
    if (!joinSlug.trim()) return { success: false };
    try {
      set({ joining: true, error: "" });
      const res = await axios.get(`${API_URL}/room/${joinSlug.trim()}`);
      if (res.data.room) {
        if (res.data.room.hasPassword && !joinNeedsPassword) {
          set({ joinNeedsPassword: true, joining: false });
          return { success: false, needsPassword: true };
        }
        if (res.data.room.hasPassword) {
          const verifyRes = await axios.post(
            `${API_URL}/room/verify-password`,
            {
              slug: joinSlug.trim(),
              password: joinPassword,
            }
          );
          if (!verifyRes.data.verified) {
            set({ error: "Incorrect password.", joining: false });
            return { success: false };
          }
          sessionStorage.setItem("room_pwd", joinPassword);
        }
        set({ joining: false });
        return { success: true, slug: joinSlug.trim() };
      } else {
        set({
          error: "Room not found. Check the slug and try again.",
          joining: false,
        });
        return { success: false };
      }
    } catch (err: any) {
      if (err?.response?.status === 403) {
        set({ error: "Incorrect password.", joining: false });
      } else {
        set({
          error: "Room not found. Check the slug and try again.",
          joining: false,
        });
      }
      return { success: false };
    }
  },

  // Delete a room
  deleteRoom: async (slug, token) => {
    try {
      set({ deleting: slug });
      await axios.delete(`${API_URL}/room/${slug}`, {
        headers: { authorization: token },
      });
      set((state) => ({
        rooms: state.rooms.filter((r) => r.slug !== slug),
        deleting: null,
      }));
      return true;
    } catch {
      set({ error: "Failed to delete room", deleting: null });
      return false;
    }
  },

  // Reset helpers
  resetCreateModal: () =>
    set({ showModal: false, newRoomName: "", newRoomPassword: "", showNewRoomPassword: false }),
  resetJoinModal: () =>
    set({
      showJoinModal: false,
      joinSlug: "",
      joinPassword: "",
      joinNeedsPassword: false,
      showJoinPassword: false,
    }),
}));
