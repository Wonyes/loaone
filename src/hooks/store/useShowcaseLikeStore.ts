import { create } from "zustand";

interface LikeEntry {
  count: number;
  liked: boolean;
}

interface ShowcaseLikeState {
  likes: Record<string, LikeEntry>;
  init: (id: string, count: number, liked: boolean) => void;
  toggle: (id: string) => void;
  get: (id: string) => LikeEntry | undefined;
}

export const useShowcaseLikeStore = create<ShowcaseLikeState>((set, get) => ({
  likes: {},
  init: (id, count, liked) => {
    set(state => ({
      likes: { ...state.likes, [id]: { count, liked } },
    }));
  },
  toggle: (id) => {
    const entry = get().likes[id];
    if (!entry) return;
    set(state => ({
      likes: {
        ...state.likes,
        [id]: {
          liked: !entry.liked,
          count: entry.liked ? entry.count - 1 : entry.count + 1,
        },
      },
    }));
  },
  get: (id) => get().likes[id],
}));
