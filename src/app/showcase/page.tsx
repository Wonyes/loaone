import { Metadata } from "next";
import ShowcasePageClient from "../../components/character/ShowcasePageClient";

export const metadata: Metadata = {
  title: "아바타 자랑 - SHOWCASE",
  description: "로스트아크 유저들의 아바타 갤러리",
};

export default function ShowcasePage() {
  return <ShowcasePageClient />;
}
