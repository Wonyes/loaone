import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useUserStore } from "../zustand/useUserStore";
import { useRouter } from "next/navigation";

export function useAuth() {
  const setUser = useUserStore((state) => state.setUser);

  return useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      try {
        const res = await api.get("/auth/me");
        const userData = res.data.user;
        setUser(userData);
        return userData;
      } catch (err) {
        setUser(null);
        return null;
      }
    },
    retry: false,
  });
}
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useUserStore((state) => state.setUser);

  return useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      setUser(null);
      queryClient.setQueryData(["auth"], null);
      router.refresh();
    },
  });
}
