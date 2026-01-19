import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5분
        gcTime: 30 * 60 * 1000, // 30분
      },
    },
  });
};

let browserQueryClient: QueryClient | undefined = undefined;

export const getQueryClient = cache(() => {
  if (typeof window === "undefined") {
    // 서버: 항상 새 QueryClient 생성
    return makeQueryClient();
  }
  // 브라우저: 싱글톤으로 재사용
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
});
