import { Metadata } from "next";
import ShowcaseDetailClient from "./ShowcaseDetailClient";

export const metadata: Metadata = {
  title: "아바타 자랑 - SHOWCASE",
  description: "로스트아크 유저의 아바타 자랑",
};

export default function ShowcaseDetailPage() {
  return <ShowcaseDetailClient />;
}
